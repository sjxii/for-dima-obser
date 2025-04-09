import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryRepository,
  CategorySelectModel,
} from './categories.repository';
import { CreateCategoryDto } from './dto/categories.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async createCategories(
    createCategoryDto: CreateCategoryDto,
  ): Promise<void> {
    const { name, userId } = createCategoryDto;
    const category = { name, userId };

    await this.categoryRepository.create(category);

    const cacheKey = `categories:${userId}`;
    await this.cacheManager.del(cacheKey);
  }

  public async getUserCategories(
    userId: string,
  ): Promise<CategorySelectModel[]> {
    const cacheKey = `categories:${userId}`;

    const cachedCategories =
      await this.cacheManager.get<CategorySelectModel[]>(cacheKey);
    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.categoryRepository.findByUserId(userId);

    await this.cacheManager.set(cacheKey, categories, 60);

    return categories;
  }

  public async deleteCategories(id: string, userId: string): Promise<void> {
    await this.categoryRepository.deleteByIdAndUserId(id, userId);

    const cacheKey = `categories:${userId}`;
    await this.cacheManager.del(cacheKey);
  }
}
