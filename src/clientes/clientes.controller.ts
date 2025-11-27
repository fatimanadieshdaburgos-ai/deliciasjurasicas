// src/clientes/clientes.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);     // POST /clientes
  }

  @Get()
  findAll() {
    return this.service.findAll();       // GET /clientes
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);    // GET /clientes/:id
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.service.update(+id, dto); // PATCH /clientes/:id
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);      // DELETE /clientes/:id
  }
}
