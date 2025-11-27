import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole, OrderStatus } from '@prisma/client';
import { CashBoxModule, CashBoxService } from '../cash-box/cash-box.module';
import { ProductionModule } from '../production/production.module';
import { ProductionService } from '../production/production.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private cashBoxService: CashBoxService,
        private productionService: ProductionService,
    ) { }

    async create(data: any, userId: string) {
        // 1. Fetch products to get real prices
        const productIds = data.items.map((item: any) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // 2. Calculate items with prices
        let orderSubtotal = 0;
        const orderItems = data.items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);

            const unitPrice = product.salePrice || 0;
            const subtotal = unitPrice * item.quantity;
            orderSubtotal += subtotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: unitPrice,
                subtotal: subtotal,
                total: subtotal, // Assuming no item discounts for now
            };
        });

        // 3. Check for active CashBox (if user is VENDEDOR or ADMIN)
        // We try to link it. If no active box, we just don't link (or we could enforce it for POS)
        const activeCashBox = await this.cashBoxService.getActive(userId);

        // 4. Create Order
        const order = await this.prisma.order.create({
            data: {
                type: 'ONLINE', // Default to ONLINE
                customerId: userId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,

                // Schema has 'deliveryAddressId', 'customerName', etc.
                // Let's check schema again. Order has 'deliveryAddressId' (optional relation).
                // It does NOT have a plain text address field.
                // So we MUST create an Address or put it in notes.
                // Let's put it in notes.
                notes: `${data.notes || ''}\nDirección: ${data.deliveryAddress}`,

                subtotal: orderSubtotal,
                total: orderSubtotal, // + shipping if applicable
                status: OrderStatus.PENDING,
                paymentMethod: data.paymentMethod,

                // Link to CashBox if exists
                cashBoxId: activeCashBox?.id,

                items: {
                    create: orderItems,
                },
            },
            include: { items: { include: { product: true } } },
        });

        // Auto-production removed as per user request to avoid double counting.
        // Stock will be deducted upon delivery.

        return order;
    }

    async findAll(userId?: string, role?: string, page: number = 1, limit: number = 20) {
        const where: any = {};
        if (role === 'CLIENTE') where.customerId = userId;

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: { items: { include: { product: true } }, customer: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    async updateStatus(id: string, status: OrderStatus, userId?: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!order) throw new Error('Order not found');

        let cashBoxId = order.cashBoxId;

        // If status changes to PAID or DELIVERED and no cash box is linked, try to link to current user's box
        if ((status === OrderStatus.PAID || status === OrderStatus.DELIVERED) && !cashBoxId && userId) {
            const activeBox = await this.cashBoxService.getActive(userId);
            if (activeBox) {
                cashBoxId = activeBox.id;
            }
        }

        // STOCK DEDUCTION LOGIC
        // Only deduct if transitioning TO DELIVERED and wasn't already DELIVERED or COMPLETED
        if (status === OrderStatus.DELIVERED && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.COMPLETED) {
            await this.prisma.$transaction(async (tx) => {
                for (const item of order.items) {
                    // Fetch current stock before updating
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { currentStock: true }
                    });

                    const previousStock = product.currentStock;
                    const newStock = previousStock - item.quantity;

                    // 1. Deduct stock
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { currentStock: newStock },
                    });

                    // 2. Record movement with actual stock values
                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            type: 'VENTA',
                            quantity: -item.quantity,
                            previousStock,
                            newStock,
                            orderId: order.id,
                            notes: `Venta Online/POS - Orden #${order.orderNumber}`,
                        }
                    });
                }
            });
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                status,
                cashBoxId, // Update link if found
                paidAt: status === OrderStatus.PAID ? new Date() : undefined,
                completedAt: status === OrderStatus.DELIVERED ? new Date() : undefined,
            },
        });
    }
}

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private service: OrdersService) { }

    @Post()
    create(@Body() dto: any, @GetUser() user: User) {
        return this.service.create(dto, user.id);
    }

    @Get()
    findAll(
        @GetUser() user: User,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        return this.service.findAll(user.id, user.role, +page, +limit);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.VENDEDOR)
    updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus, @GetUser() user: User) {
        return this.service.updateStatus(id, status, user.id);
    }
}

@Module({
    imports: [CashBoxModule, ProductionModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
