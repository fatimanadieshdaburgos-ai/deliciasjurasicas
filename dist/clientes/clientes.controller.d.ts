import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly service;
    constructor(service: ClientesService);
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
    findOne(id: string): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    } | null>;
    update(id: string, dto: UpdateClienteDto): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        nombre: string;
        email: string | null;
        telefono: string | null;
        id: number;
        createdAt: Date;
    }>;
}
