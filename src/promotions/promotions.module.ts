// ======================
// MÓDULOS PLACEHOLDER  
// Estructura básica funcional para compilar
// ======================

import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

// ====== PROMOTIONS ======
@Injectable()
export class PromotionsService {
    constructor(private prisma: PrismaService) { }

    async validate(code: string, orderTotal: number) {
        const promo = await this.prisma.promotion.findUnique({ where: { code, isActive: true } });
        if (!promo) return null;

        const now = new Date();
        if (now < promo.startDate || now > promo.endDate) return null;
        if (promo.minPurchase && orderTotal < promo.minPurchase) return null;

        let discount = 0;
        if (promo.type === 'PERCENTAGE') discount = orderTotal * (promo.discountValue / 100);
        else if (promo.type === 'FIXED_AMOUNT') discount = promo.discountValue;

        if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
        return { discount, promotion: promo };
    }
}

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
    constructor(private service: PromotionsService) { }

    @Post('validate')
    validate(@Body() dto: any) {
        return this.service.validate(dto.code, dto.orderTotal);
    }
}

@Module({
    controllers: [PromotionsController],
    providers: [PromotionsService],
    exports: [PromotionsService],
})
export class PromotionsModule { }
