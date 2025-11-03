import { ApiProperty } from "@nestjs/swagger";
import { UpdateClienteDto } from "./update-cliente.dto";

export class CreateClienteDto {
  @ApiProperty({required: true, example: 'Renzo',})
  nombre: string;     // ← REQUERIDO
  @ApiProperty({required: true, example: 'nombre@.dinosaurio.com', default:'nombre@.dinosaurio.com'})
  email?: string;     // opcional si en Prisma es String?
  @ApiProperty({required: true, example: '77791252', default: '77791252'})
  telefono?: string;  // opcional si en Prisma es String?
}



