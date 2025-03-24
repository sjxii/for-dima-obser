import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/categories.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createCategories(
    @CurrentUser() user,
    @Body() body: CreateCategoriesDto,
  ): Promise<void> {
    return await this.categoriesService.createCategories(
      body.category,
      user.id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUserCategories(@CurrentUser() user) {
    return await this.categoriesService.getUserCategories(user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteCategory(
    @Param('id') id: string,
    @CurrentUser() user,
  ): Promise<void> {
    return await this.categoriesService.deleteCategories(user.id, id);
  }
}
