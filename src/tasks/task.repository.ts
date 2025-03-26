import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Database, DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from '../database/schema';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { UpdateTaskDto } from './dto/task.dto';

export type TaskSelectModel = InferSelectModel<typeof schema.tasks>;
export type TaskInsertModel = InferInsertModel<typeof schema.tasks>;

@Injectable()
export class TasksRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly database: Database,
  ) {}

  public async createTask(task: TaskInsertModel): Promise<void> {
    await this.database.insert(schema.tasks).values(task);
  }

  public async getTasks(userId: string, categoryId?: string, status?: string) {
    let conditions = [eq(schema.tasks.userId, userId)];

    if (categoryId) {
      conditions.push(eq(schema.tasks.categoryId, categoryId));
    }

    if (status) {
      if (!schema.statusEnum.enumValues.includes(status as any)) {
        throw new BadRequestException(
          `Invalid status. Allowed values: ${schema.statusEnum.enumValues.join(', ')}`,
        );
      }
      conditions.push(
        eq(schema.tasks.status, status as 'TODO' | 'In Progress' | 'Done'),
      );
    }

    return await this.database
      .select()
      .from(schema.tasks)
      .where(and(...conditions));
  }

  public async getUserTaskById(taskId: string, userId: string) {
    const task = await this.database
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)))
      .limit(1);

    return task.length > 0 ? task[0] : null;
  }

  public async updateTask(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.database
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, taskId))
      .limit(1);

    if (task.length === 0 || task[0].userId !== userId) {
      return null;
    }

    return await this.database
      .update(schema.tasks)
      .set(updateTaskDto)
      .where(eq(schema.tasks.id, taskId));
  }

  public async deleteTask(
    userId: string,
    taskId: string,
  ): Promise<null | undefined> {
    const task = await this.database
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return null;
    }

    await this.database.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
  }
}
