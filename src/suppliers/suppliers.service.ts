import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';

@Injectable()
export class SuppliersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateSupplierDto) {
        return this.prisma.supplier.create({
            data: dto,
        });
    }

    async findAll(page: number = 1, limit: number = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where: any = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    _count: { select: { products: true } }
                }
            }),
            this.prisma.supplier.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id },
            include: { products: true }
        });
        if (!supplier) throw new NotFoundException('Proveedor no encontrado');
        return supplier;
    }

    async update(id: string, dto: UpdateSupplierDto) {
        await this.findOne(id);
        return this.prisma.supplier.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.supplier.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
