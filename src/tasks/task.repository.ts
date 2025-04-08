import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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

  public async getTasks(
    userId: string,
    categoryId?: string,
    status?: string,
  ): Promise<TaskSelectModel[]> {
    let conditions = [eq(schema.tasks.userId, userId)];

    if (categoryId) {
      conditions.push(eq(schema.tasks.categoryId, categoryId));
    }

    if (status) {
      if (
        !schema.statusEnum.enumValues.includes(
          status as 'TODO' | 'In Progress' | 'Done',
        )
      ) {
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

  public async getUserTaskById(
    taskId: string,
    userId: string,
  ): Promise<TaskSelectModel> {
    const task = await this.database
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)));

    return task[0] || null;
  }

  public async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskSelectModel> {
    const [updated] = await this.database
      .update(schema.tasks)
      .set(updateTaskDto)
      .where(eq(schema.tasks.id, taskId))
      .returning();

    if (!updated) throw new NotFoundException(`Cannot find task with id`);
    return updated;
  }

  public async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.database
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)));

    if (!task[0]) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

    await this.database.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
  }
}
