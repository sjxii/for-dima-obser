import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async createCategories(
    createCategoryDto: CreateCategoryDto,
  ): Promise<void> {
    const { name, userId } = createCategoryDto;
    const category = { name, userId };

    await this.categoryRepository.create(category);
  }

  public async getUserCategories(userId: string) {
    return await this.categoryRepository.findByUserId(userId);
  }

  public async deleteCategories(id: string, userId: string) {
    await this.categoryRepository.deleteByIdAndUserId(id, userId);
  }
}
