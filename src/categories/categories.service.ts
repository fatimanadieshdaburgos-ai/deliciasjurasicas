import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        // Generate slug from name
        const slug = dto.slug || this.generateSlug(dto.name);

        // Check if slug already exists
        const existing = await this.prisma.category.findUnique({ where: { slug } });
        if (existing) {
            throw new ConflictException('El slug ya existe');
        }

        return this.prisma.category.create({
            data: { ...dto, slug },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: { isActive: true },
                    take: 10,
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findOne(id);

        if (dto.slug) {
            const existing = await this.prisma.category.findFirst({
                where: { slug: dto.slug, NOT: { id } },
            });
            if (existing) {
                throw new ConflictException('El slug ya existe');
            }
        }

        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}
