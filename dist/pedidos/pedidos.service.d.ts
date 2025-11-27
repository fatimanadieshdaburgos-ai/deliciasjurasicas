import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class PedidosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPedidoDto: CreatePedidoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePedidoDto: UpdatePedidoDto): string;
    remove(id: number): string;
}
