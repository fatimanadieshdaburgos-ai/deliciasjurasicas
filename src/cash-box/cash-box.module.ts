import { Module } from '@nestjs/common';
import { Injectable, Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class CashBoxService {
    constructor(private prisma: PrismaService) { }

    async open(userId: string, openingAmount: number, boxNumber: string) {
        return this.prisma.cashBox.create({
            data: { userId, openingAmount, boxNumber, status: 'OPEN' },
        });
    }

    async close(cashBoxId: string, actualAmount: number) {
        const cashBox = await this.prisma.cashBox.findUnique({
            where: { id: cashBoxId },
            include: { orders: true, transactions: true },
        });

        const salesTotal = cashBox.orders.reduce((sum, o) => sum + o.total, 0);
        const transactionsTotal = cashBox.transactions.reduce((sum, t) => sum + t.amount, 0);
        const expectedAmount = cashBox.openingAmount + salesTotal + transactionsTotal;

        return this.prisma.cashBox.update({
            where: { id: cashBoxId },
            data: {
                status: 'CLOSED',
                actualAmount,
                expectedAmount,
                difference: actualAmount - expectedAmount,
                closedAt: new Date(),
            },
        });
    }

    async getActive(userId: string) {
        return this.prisma.cashBox.findFirst({
            where: { userId, status: 'OPEN' },
            include: { orders: true, transactions: true },
        });
    }

    async getHistory(userId: string) {
        return this.prisma.cashBox.findMany({
            where: { userId, status: 'CLOSED' },
            orderBy: { closedAt: 'desc' },
            take: 10,
        });
    }

    async addTransaction(cashBoxId: string, type: 'DEPOSIT' | 'WITHDRAWAL', amount: number, description: string) {
        // Use TransactionType enum from Prisma if available, or string literal if mapped
        // Checking schema: enum TransactionType { SALE, REFUND, EXPENSE, WITHDRAWAL, DEPOSIT, ADJUSTMENT }
        return this.prisma.cashTransaction.create({
            data: {
                cashBoxId,
                type: type as any, // Cast to any to avoid strict enum checks if import missing, but better to import
                amount,
                description,
            },
        });
    }
}

@ApiTags('CashBox')
@Controller('cash-box')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VENDEDOR, UserRole.ADMIN)
@ApiBearerAuth()
export class CashBoxController {
    constructor(private service: CashBoxService) { }

    @Post('open')
    open(@GetUser() user: User, @Body() dto: any) {
        return this.service.open(user.id, dto.openingAmount, dto.boxNumber);
    }

    @Post('close')
    close(@Body() dto: any) {
        return this.service.close(dto.cashBoxId, dto.actualAmount);
    }

    @Get('active')
    getActive(@GetUser() user: User) {
        return this.service.getActive(user.id);
    }

    @Get('history')
    getHistory(@GetUser() user: User) {
        return this.service.getHistory(user.id);
    }

    @Post('transaction')
    addTransaction(@Body() dto: any) {
        return this.service.addTransaction(dto.cashBoxId, dto.type, dto.amount, dto.description);
    }
}

@Module({
    controllers: [CashBoxController],
    providers: [CashBoxService],
    exports: [CashBoxService],
})
export class CashBoxModule { }
