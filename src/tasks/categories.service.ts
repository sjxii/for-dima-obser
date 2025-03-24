import { Inject, Injectable } from '@nestjs/common';
import { Database, DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from '../database/schema';
import { and, eq } from 'drizzle-orm';

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

  public async getUserCategories(userId: string) {
    return await this.database
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.userId, userId));
  }

  public async deleteCategories(id: string, userId: string) {
    await this.database
      .delete(schema.categories)
      .where(
        and(eq(schema.categories.id, id), eq(schema.categories.userId, userId)),
      );
  }
}
