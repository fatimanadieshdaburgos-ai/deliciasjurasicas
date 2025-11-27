import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPedidoDto: CreatePedidoDto) {
    return 'Esta acción lograr añadir un nuevo pedido';
  }

  findAll() {
    return 'This action know the pedidos :D';
  }

  findOne(id: number) {
    return `Esta acción retorna el pedido número #${id}`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `Esta acción actualiza el pedido número #${id}`;
  }

  remove(id: number) {
    return `Esta acción elimina/cancela el pedido número #${id}`;
  }
}
