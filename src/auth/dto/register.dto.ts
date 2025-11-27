import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'cliente@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: '5551234567', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
}
