import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Estadísticas generales del dashboard' })
    getDashboardStats() {
        return this.reportsService.getDashboardStats();
    }

    @Get('sales')
    @ApiOperation({ summary: 'Reporte de ventas' })
    getSalesReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getSalesReport(startDate, endDate);
    }

    @Get('inventory')
    @ApiOperation({ summary: 'Reporte de inventario' })
    getInventoryReport() {
        return this.reportsService.getInventoryReport();
    }
}
