import { Inject, Injectable } from '@nestjs/common';
import { Database, DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly database: Database,
  ) {}

  public async createCategories(name: string, userId: string): Promise<void> {
    await this.database
      .insert(schema.categories)
      .values({ name, userId: userId });
  }
}
