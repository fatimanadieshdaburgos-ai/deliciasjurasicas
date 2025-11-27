import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateAddressDto) {
        // If this is the first address, make it default
        const count = await this.prisma.address.count({ where: { userId } });
        const isDefault = count === 0 ? true : dto.isDefault;

        if (isDefault) {
            // Unset other defaults
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.create({
            data: {
                ...dto,
                userId,
                isDefault,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const address = await this.prisma.address.findUnique({ where: { id } });
        if (!address) throw new NotFoundException('Address not found');
        if (address.userId !== userId) throw new ForbiddenException('Access denied');
        return address;
    }

    async update(userId: string, id: string, dto: UpdateAddressDto) {
        await this.findOne(userId, id); // Check ownership

        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id); // Check ownership
        return this.prisma.address.delete({ where: { id } });
    }
}
