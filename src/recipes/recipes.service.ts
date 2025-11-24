import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { ProductType } from '@prisma/client';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Verificar que el producto existe y es tipo PRODUCTO_TERMINADO
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (product.type !== ProductType.PRODUCTO_TERMINADO) {
            throw new BadRequestException('Solo se pueden crear recetas para productos terminados');
        }

        // Verificar que todos los ingredientes sean tipo INSUMO
        const ingredientIds = data.ingredients.map((i: any) => i.ingredientId);
        const ingredients = await this.prisma.product.findMany({
            where: { id: { in: ingredientIds } },
        });

        const invalidIngredients = ingredients.filter(
            (ing) => ing.type !== ProductType.INSUMO,
        );

        if (invalidIngredients.length > 0) {
            throw new BadRequestException(
                `Los siguientes productos no son insumos: ${invalidIngredients.map((i) => i.name).join(', ')}`,
            );
        }

        // Crear receta con ingredientes
        return this.prisma.recipe.create({
            data: {
                productId: data.productId,
                name: data.name,
                description: data.description,
                yieldQuantity: data.yieldQuantity,
                yieldUnit: data.yieldUnit,
                preparationTime: data.preparationTime,
                instructions: data.instructions,
                ingredients: {
                    create: data.ingredients,
                },
            },
            include: {
                product: true,
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.recipe.findMany({
            include: {
                product: true,
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id },
            include: {
                product: true,
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });

        if (!recipe) {
            throw new NotFoundException('Receta no encontrada');
        }

        return recipe;
    }

    async update(id: string, data: any) {
        await this.findOne(id);

        // Si se actualizan ingredientes, hacer validaciones
        if (data.ingredients) {
            const ingredientIds = data.ingredients.map((i: any) => i.ingredientId);
            const ingredients = await this.prisma.product.findMany({
                where: { id: { in: ingredientIds } },
            });

            const invalidIngredients = ingredients.filter(
                (ing) => ing.type !== ProductType.INSUMO,
            );

            if (invalidIngredients.length > 0) {
                throw new BadRequestException('Solo se pueden usar insumos como ingredientes');
            }

            // Eliminar ingredientes existentes y crear nuevos
            await this.prisma.recipeIngredient.deleteMany({
                where: { recipeId: id },
            });
        }

        return this.prisma.recipe.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                yieldQuantity: data.yieldQuantity,
                yieldUnit: data.yieldUnit,
                preparationTime: data.preparationTime,
                instructions: data.instructions,
                ingredients: data.ingredients
                    ? {
                        create: data.ingredients,
                    }
                    : undefined,
            },
            include: {
                product: true,
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.recipe.delete({
            where: { id },
        });
    }
}
