import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    create(createPedidoDto: CreatePedidoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePedidoDto: UpdatePedidoDto): string;
    remove(id: string): string;
}
