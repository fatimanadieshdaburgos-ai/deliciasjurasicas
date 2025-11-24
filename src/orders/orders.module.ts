import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, userId: string) {
        return this.prisma.order.create({
            data: {
                type: data.type,
                customerId: userId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                subtotal: data.subtotal,
                total: data.total,
                status: OrderStatus.PENDING,
                items: {
                    create: data.items,
                },
            },
            include: { items: { include: { product: true } } },
        });
    }

    async findAll(userId?: string, role?: string) {
        const where: any = {};
        if (role === 'CLIENTE') where.customerId = userId;

        return this.prisma.order.findMany({
            where,
            include: { items: { include: { product: true } }, customer: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, status: OrderStatus) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
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
    findAll(@GetUser() user: User) {
        return this.service.findAll(user.id, user.role);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.VENDEDOR)
    updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
        return this.service.updateStatus(id, status);
    }
}

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
