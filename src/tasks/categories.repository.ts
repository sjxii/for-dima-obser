import { Inject, Injectable } from '@nestjs/common';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Database, DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';

export type CategorySelectModel = InferSelectModel<typeof schema.categories>;
export type CategoryInsertModel = InferInsertModel<typeof schema.categories>;

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: Database,
  ) {}

  public async findByUserId(
    userId: CategorySelectModel['userId'],
  ): Promise<CategorySelectModel[]> {
    return this.database
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.userId, userId));
  }

  public async create(category: CategoryInsertModel): Promise<void> {
    await this.database.insert(schema.categories).values(category);
  }

  public async deleteByIdAndUserId(id: string, userId: string): Promise<void> {
    await this.database
      .delete(schema.categories)
      .where(
        and(eq(schema.categories.id, id), eq(schema.categories.userId, userId)),
      );
  }
}
