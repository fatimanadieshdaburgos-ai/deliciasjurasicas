import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('stock')
    @Roles(UserRole.ADMIN, UserRole.PANADERO, UserRole.VENDEDOR)
    getStock() {
        return this.inventoryService.getStock();
    }

    @Get('low-stock')
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    getLowStock() {
        return this.inventoryService.getLowStock();
    }

    @Get('movements')
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    getMovements(@Query('productId') productId?: string) {
        return this.inventoryService.getMovements(productId);
    }

    @Post('adjust')
    @Roles(UserRole.ADMIN)
    adjustStock(@Body() dto: any) {
        return this.inventoryService.adjustStock(dto.productId, dto.quantity, dto.notes);
    }
}
