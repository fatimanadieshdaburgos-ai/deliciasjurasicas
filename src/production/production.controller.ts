import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole, User } from '@prisma/client';

@ApiTags('Production')
@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductionController {
    constructor(private readonly productionService: ProductionService) { }

    @Post('orders')
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    @ApiOperation({ summary: 'Crear orden de producción' })
    create(@Body() createDto: any) {
        return this.productionService.create(createDto);
    }

    @Get('orders')
    @ApiOperation({ summary: 'Listar órdenes de producción' })
    findAll(@Query() filters: any) {
        return this.productionService.findAll(filters);
    }

    @Get('orders/:id')
    @ApiOperation({ summary: 'Obtener orden de producción' })
    findOne(@Param('id') id: string) {
        return this.productionService.findOne(id);
    }

    @Patch('orders/:id/start')
    @Roles(UserRole.PANADERO)
    @ApiOperation({ summary: 'Iniciar producción' })
    start(@Param('id') id: string, @GetUser() user: User) {
        return this.productionService.start(id, user.id);
    }

    @Patch('orders/:id/complete')
    @Roles(UserRole.PANADERO, UserRole.ADMIN)
    @ApiOperation({ summary: 'Completar producción (descuenta insumos)' })
    complete(@Param('id') id: string) {
        return this.productionService.complete(id);
    }

    @Patch('orders/:id/cancel')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Cancelar orden de producción' })
    cancel(@Param('id') id: string) {
        return this.productionService.cancel(id);
    }
}
