import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/categories.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('users/:userId')
  @UseGuards(JwtAuthGuard)
  public async createCategories(
    @Param('userId') userId: string,
    @Body() body: CreateCategoriesDto,
  ): Promise<void> {
    return await this.categoriesService.createCategories(body.category, userId);
  }
}
// TODO GET categories (checkAllCategories)

// TODO DELETE catedories (deleteCategories)
