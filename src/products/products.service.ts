import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto';
import { ProductType } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProductDto) {
        // Verificar SKU único
        const existing = await this.prisma.product.findUnique({
            where: { sku: dto.sku },
        });

        if (existing) {
            throw new BadRequestException('El SKU ya existe');
        }

        // Validar que productos terminados tengan precio de venta
        if (dto.type === ProductType.PRODUCTO_TERMINADO && !dto.salePrice) {
            throw new BadRequestException(
                'Los productos terminados deben tener precio de venta',
            );
        }

        return this.prisma.product.create({
            data: dto,
            include: {
                category: true,
                images: true,
            },
        });
    }

    async findAll(filters: ProductFilterDto) {
        const { page = 1, limit = 20, type, isActive, isFeatured, categoryId, search } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (type) where.type = type;
        if (typeof isActive === 'boolean') where.isActive = isActive;
        if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: {
                            orderItems: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
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

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);

        if (dto.sku) {
            const existing = await this.prisma.product.findFirst({
                where: { sku: dto.sku, NOT: { id } },
            });
            if (existing) {
                throw new BadRequestException('El SKU ya existe');
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: {
                category: true,
                images: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Soft delete
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getFeatured() {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true,
                type: ProductType.PRODUCTO_TERMINADO,
            },
            include: {
                category: true,
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            take: 10,
        });
    }

    async getLowStock() {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                currentStock: {
                    lte: this.prisma.product.fields.minStock,
                },
            },
            orderBy: { currentStock: 'asc' },
        });
    }
}
