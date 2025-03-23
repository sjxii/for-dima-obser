import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    @CurrentUser() user, // Потягувати користувача з контексту
    @Body() body: CreateCategoriesDto,
  ): Promise<void> {
    return await this.categoriesService.createCategories(
      body.category,
      user.id,
    );
  }
}

// TODO GET categories (checkAllCategories)

// TODO DELETE catedories (deleteCategories)
