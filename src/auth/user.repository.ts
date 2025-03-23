import { Inject, Injectable } from '@nestjs/common';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Database, DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';

export type UserSelectModel = InferSelectModel<typeof schema.users>;
export type UserInsertModel = InferInsertModel<typeof schema.users>;

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: Database,
  ) {}

  public async findByEmail(
    email: UserSelectModel['email'],
  ): Promise<UserSelectModel | undefined> {
    const [found] = await this.database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return found;
  }

  public async create(user: UserInsertModel): Promise<void> {
    await this.database.insert(schema.users).values(user);
  }
}
