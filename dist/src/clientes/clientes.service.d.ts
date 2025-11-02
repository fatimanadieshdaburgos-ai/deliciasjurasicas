import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ClientesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClienteDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: UpdateClienteDto): Promise<any>;
    remove(id: number): Promise<any>;
}
