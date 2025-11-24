import {
    IsEmail,
    IsString,
    IsEnum,
    IsOptional,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({ enum: UserStatus, required: false })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
