import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async sales(startDate: Date, endDate: Date) {
        return this.prisma.order.groupBy({
            by: ['status'],
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
            _sum: { total: true },
            _count: true,
        });
    }

    async topProducts(limit = 10) {
        return this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true, total: true },
            orderBy: { _sum: { total: 'desc' } },
            take: limit,
        });
    }
}

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class ReportsController {
    constructor(private service: ReportsService) { }

    @Get('sales')
    sales(@Query('start') start: string, @Query('end') end: string) {
        return this.service.sales(new Date(start), new Date(end));
    }

    @Get('top-products')
    topProducts(@Query('limit') limit?: string) {
        return this.service.topProducts(limit ? parseInt(limit) : 10);
    }
}

@Module({
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule { }
