import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { ProductionStatus } from '@prisma/client';

@Injectable()
export class ProductionService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crear orden de producción
     */
    async create(data: any) {
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
            include: {
                recipe: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (!product.recipe) {
            throw new BadRequestException(
                `El producto ${product.name} no tiene receta definida`,
            );
        }

        // Verificar disponibilidad de insumos
        for (const recipeIngredient of product.recipe.ingredients) {
            const requiredQty = recipeIngredient.quantity * data.quantity;
            if (recipeIngredient.ingredient.currentStock < requiredQty) {
                throw new BadRequestException(
                    `Stock insuficiente de ${recipeIngredient.ingredient.name}. ` +
                    `Necesario: ${requiredQty} ${recipeIngredient.ingredient.measureUnit}, ` +
                    `Disponible: ${recipeIngredient.ingredient.currentStock}`,
                );
            }
        }

        return this.prisma.productionOrder.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                status: ProductionStatus.PENDIENTE,
                assignedToId: data.assignedToId,
                scheduledDate: data.scheduledDate,
                notes: data.notes,
            },
            include: {
                assignedTo: true,
            },
        });
    }

    async findAll(filters: any = {}) {
        const { status, assignedToId } = filters;
        const where: any = {};

        if (status) where.status = status;
        if (assignedToId) where.assignedToId = assignedToId;

        return this.prisma.productionOrder.findMany({
            where,
            include: {
                assignedTo: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const order = await this.prisma.productionOrder.findUnique({
            where: { id },
            include: {
                assignedTo: true,
                stockMovements: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Orden de producción no encontrada');
        }

        return order;
    }

    /**
     * Iniciar producción
     */
    async start(id: string, userId: string) {
        const order = await this.findOne(id);

        if (order.status !== ProductionStatus.PENDIENTE) {
            throw new BadRequestException('La orden ya fue iniciada');
        }

        return this.prisma.productionOrder.update({
            where: { id },
            data: {
                status: ProductionStatus.EN_PROCESO,
                assignedToId: userId,
                startedAt: new Date(),
            },
        });
    }

    /**
     * COMPLETAR PRODUCCIÓN - LÓGICA CRÍTICA
     * Descuenta insumos e incrementa producto terminado
     */
    async complete(id: string) {
        const order = await this.prisma.productionOrder.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        recipe: {
                            include: {
                                ingredients: {
                                    include: {
                                        ingredient: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Orden de producción no encontrada');
        }

        if (order.status === ProductionStatus.COMPLETADO) {
            throw new BadRequestException('La orden ya fue completada');
        }

        if (!order.product.recipe) {
            throw new BadRequestException('El producto no tiene receta');
        }

        // TRANSACCIÓN ATÓMICA
        return this.prisma.$transaction(async (tx) => {
            // 1. DESCONTAR INSUMOS
            for (const recipeIngredient of order.product.recipe.ingredients) {
                const ingredient = recipeIngredient.ingredient;
                const quantityNeeded = recipeIngredient.quantity * order.quantity;

                const previousStock = ingredient.currentStock;
                const newStock = previousStock - quantityNeeded;

                if (newStock < 0) {
                    throw new BadRequestException(
                        `Stock insuficiente de ${ingredient.name}`,
                    );
                }

                // Actualizar stock del insumo
                await tx.product.update({
                    where: { id: ingredient.id },
                    data: { currentStock: newStock },
                });

                // Registrar movimiento de salida
                await tx.stockMovement.create({
                    data: {
                        productId: ingredient.id,
                        type: 'PRODUCCION_SALIDA',
                        quantity: -quantityNeeded,
                        previousStock,
                        newStock,
                        productionOrderId: order.id,
                        costPerUnit: ingredient.costPrice,
                    },
                });
            }

            // 2. INCREMENTAR PRODUCTO TERMINADO
            const productPreviousStock = order.product.currentStock;
            const productNewStock = productPreviousStock + order.quantity;

            await tx.product.update({
                where: { id: order.productId },
                data: { currentStock: productNewStock },
            });

            // Registrar movimiento de entrada
            await tx.stockMovement.create({
                data: {
                    productId: order.productId,
                    type: 'PRODUCCION_ENTRADA',
                    quantity: order.quantity,
                    previousStock: productPreviousStock,
                    newStock: productNewStock,
                    productionOrderId: order.id,
                },
            });

            // 3. ACTUALIZAR ORDEN
            return tx.productionOrder.update({
                where: { id },
                data: {
                    status: ProductionStatus.COMPLETADO,
                    completedAt: new Date(),
                },
                include: {
                    product: true,
                    assignedTo: true,
                    stockMovements: true,
                },
            });
        });
    }

    /**
     * Cancelar orden de producción
     */
    async cancel(id: string) {
        const order = await this.findOne(id);

        if (order.status === ProductionStatus.COMPLETADO) {
            throw new BadRequestException(
                'No se puede cancelar una orden completada',
            );
        }

        return this.prisma.productionOrder.update({
            where: { id },
            data: { status: ProductionStatus.CANCELADO },
        });
    }
}
