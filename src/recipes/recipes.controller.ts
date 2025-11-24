import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    create(@Body() createRecipeDto: any) {
        return this.recipesService.create(createRecipeDto);
    }

    @Get()
    findAll() {
        return this.recipesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.recipesService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.PANADERO)
    update(@Param('id') id: string, @Body() updateRecipeDto: any) {
        return this.recipesService.update(id, updateRecipeDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.recipesService.remove(id);
    }
}
