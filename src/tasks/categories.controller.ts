import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CategoriesService } from 'src/tasks/categories.service';
import { CreateCategoryDto } from 'src/tasks/dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createCategories(
    @CurrentUser() user,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<void> {
    return await this.categoriesService.createCategories(createCategoryDto);
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
    return await this.categoriesService.deleteCategories(id, user.id);
  }
}
