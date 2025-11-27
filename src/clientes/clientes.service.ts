import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClienteDto) {
    const data: Prisma.ClientesCreateInput = {
      nombre: dto.nombre,
      email: dto.email ?? null,
      telefono: dto.telefono ?? null,
    };
    return this.prisma.clientes.create({ data });
  }

  async findAll() {
    return this.prisma.clientes.findMany();
  }

  async findOne(id: number) {
    return this.prisma.clientes.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateClienteDto) {
    return this.prisma.clientes.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.clientes.delete({ where: { id } });
  }
}

