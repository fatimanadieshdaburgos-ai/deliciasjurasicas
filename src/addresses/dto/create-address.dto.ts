import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty()
    @IsString()
    recipientName: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    street: string;

    @ApiProperty()
    @IsString()
    number: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    apartment?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    neighborhood?: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    zipCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    label?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
