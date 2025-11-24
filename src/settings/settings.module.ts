import { Module } from '@nestjs/common';
import { Injectable, Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async findAll(isPublic?: boolean) {
        return this.prisma.setting.findMany({
            where: isPublic !== undefined ? { isPublic } : undefined,
        });
    }

    async update(key: string, value: string) {
        return this.prisma.setting.upsert({
            where: { key },
            create: { key, value, type: 'TEXT' },
            update: { value },
        });
    }
}

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
    constructor(private service: SettingsService) { }

    @Get()
    findAll() {
        return this.service.findAll(true);
    }

    @Patch(':key')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    update(@Param('key') key: string, @Body('value') value: string) {
        return this.service.update(key, value);
    }
}

@Module({
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
