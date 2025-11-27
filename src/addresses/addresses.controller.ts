import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    @ApiOperation({ summary: 'Crear nueva dirección' })
    create(@GetUser() user: User, @Body() createAddressDto: CreateAddressDto) {
        return this.addressesService.create(user.id, createAddressDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar mis direcciones' })
    findAll(@GetUser() user: User) {
        return this.addressesService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener dirección por ID' })
    findOne(@GetUser() user: User, @Param('id') id: string) {
        return this.addressesService.findOne(user.id, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar dirección' })
    update(@GetUser() user: User, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressesService.update(user.id, id, updateAddressDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar dirección' })
    remove(@GetUser() user: User, @Param('id') id: string) {
        return this.addressesService.remove(user.id, id);
    }
}
