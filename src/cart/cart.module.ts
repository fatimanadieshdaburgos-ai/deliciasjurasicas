import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

// CART SERVICE
@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId: string) {
        let cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } },
            });
        }

        return cart;
    }

    async addItem(userId: string, productId: string, quantity: number) {
        const cart = await this.getCart(userId);

        return this.prisma.cartItem.upsert({
            where: { cartId_productId: { cartId: cart.id, productId } },
            create: { cartId: cart.id, productId, quantity },
            update: { quantity: { increment: quantity } },
            include: { product: true },
        });
    }

    async removeItem(userId: string, itemId: string) {
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    async clearCart(userId: string) {
        const cart = await this.getCart(userId);
        return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private service: CartService) { }

    @Get()
    getCart(@GetUser() user: User) {
        return this.service.getCart(user.id);
    }

    @Post('items')
    addItem(@GetUser() user: User, @Body() dto: any) {
        return this.service.addItem(user.id, dto.productId, dto.quantity);
    }

    @Delete('items/:id')
    removeItem(@GetUser() user: User, @Param('id') id: string) {
        return this.service.removeItem(user.id, id);
    }
}

@Module({
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule { }
