import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async getStock() {
        return this.prisma.product.findMany({
            select: {
                id: true,
                sku: true,
                name: true,
                type: true,
                currentStock: true,
                minStock: true,
                maxStock: true,
                measureUnit: true,
            },
            where: { isActive: true },
        });
    }

    async getLowStock() {
        return this.prisma.$queryRaw`
      SELECT * FROM products 
      WHERE "isActive" = true 
      AND "currentStock" <= "minStock"
      ORDER BY "currentStock" ASC
    `;
    }

    async getMovements(productId?: string) {
        return this.prisma.stockMovement.findMany({
            where: productId ? { productId } : undefined,
            include: {
                product: true,
                order: true,
                productionOrder: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async adjustStock(productId: string, quantity: number, notes?: string) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        const previousStock = product.currentStock;
        const newStock = previousStock + quantity;

        return this.prisma.$transaction([
            this.prisma.product.update({
                where: { id: productId },
                data: { currentStock: newStock },
            }),
            this.prisma.stockMovement.create({
                data: {
                    productId,
                    type: quantity > 0 ? 'AJUSTE_POSITIVO' : 'AJUSTE_NEGATIVO',
                    quantity,
                    previousStock,
                    newStock,
                    notes,
                },
            }),
        ]);
    }
}
