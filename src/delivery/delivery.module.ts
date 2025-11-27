import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class DeliveryService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.delivery.findMany({
            include: { order: true, address: true, driver: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async assignDriver(deliveryId: string, driverId: string) {
        return this.prisma.delivery.update({
            where: { id: deliveryId },
            data: { driverId, status: 'ASSIGNED' },
        });
    }
}

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeliveryController {
    constructor(private service: DeliveryService) { }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.REPARTIDOR)
    findAll() {
        return this.service.findAll();
    }

    @Patch(':id/assign/:driverId')
    @Roles(UserRole.ADMIN)
    assignDriver(@Param('id') id: string, @Param('driverId') driverId: string) {
        return this.service.assignDriver(id, driverId);
    }
}

@Module({
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService],
})
export class DeliveryModule { }
