import { ApiProperty } from "@nestjs/swagger";
import { UpdateClienteDto } from "./update-cliente.dto";

export class CreateClienteDto {


    @ApiProperty({ required: true, example: 'John Doe'})

    name: string; 

    @ApiProperty({ required: true,example: 'cliente@.com' })

    email: string;

    

    @ApiProperty({required: true, example: '1234566'})

    telefono: Int16Array; 

    @ApiProperty({required: true, example: 1, description: 'ID del Tenant'})
    tenantID: number; 

    @ApiProperty({required: true, example: '12/12/25'})

    fecha_registro: string;
}

