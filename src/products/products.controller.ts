import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear producto o insumo' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar productos con filtros' })
    findAll(@Query() filters: ProductFilterDto) {
        return this.productsService.findAll(filters);
    }

    @Get('featured')
    @ApiOperation({ summary: 'Obtener productos destacados' })
    getFeatured() {
        return this.productsService.getFeatured();
    }

    @Get('low-stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Productos con stock bajo' })
    getLowStock() {
        return this.productsService.getLowStock();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener producto por ID' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar producto' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Desactivar producto' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
