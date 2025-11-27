import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
    }

    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.findOne(id); // Verificar que existe

        const updateData: any = { ...dto };

        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Soft delete
        return this.prisma.user.update({
            where: { id },
            data: { status: 'INACTIVE' },
        });
    }
}
