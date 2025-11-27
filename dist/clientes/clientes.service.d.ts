import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ClientesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClienteDto): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    } | null>;
    update(id: number, dto: UpdateClienteDto): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }>;
}
