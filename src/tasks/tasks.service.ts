import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/task.dto';
import {
  TaskInsertModel,
  TaskSelectModel,
  TasksRepository,
} from './task.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async createTask(task: TaskInsertModel): Promise<void> {
    await this.tasksRepository.createTask(task);
  }

  public async getTasks(
    userId: string,
    categoryId?: string,
    status?: 'TODO' | 'In Progress' | 'Done',
  ): Promise<TaskSelectModel[]> {
    const cacheKey = `tasks:${userId}:${categoryId ?? 'all'}:${status ?? 'all'}`;

    const cachedTasks =
      await this.cacheManager.get<TaskSelectModel[]>(cacheKey);
    if (cachedTasks) {
      return cachedTasks;
    }

    const tasks = await this.tasksRepository.getTasks(
      userId,
      categoryId,
      status,
    );
    await this.cacheManager.set(cacheKey, tasks, 60);

    return tasks;
  }

  public async getUserTaskById(
    taskId: string,
    userId: string,
  ): Promise<TaskSelectModel> {
    const cacheKey = `task:${taskId}:${userId}`;

    const cachedTask = await this.cacheManager.get<TaskSelectModel>(cacheKey);
    if (cachedTask) {
      return cachedTask;
    }

    const task = await this.tasksRepository.getUserTaskById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

    await this.cacheManager.set(cacheKey, task, 60);

    return task;
  }

  public async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskSelectModel> {
    const updatedTask = await this.tasksRepository.updateTask(
      taskId,
      updateTaskDto,
    );

    if (!updatedTask) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

    const cacheKey = `task:${taskId}:${updatedTask.userId}`;
    await this.cacheManager.del(cacheKey);

    const tasksCacheKey = `tasks:${updatedTask.userId}:${updatedTask.categoryId}:${updatedTask.status}`;
    await this.cacheManager.del(tasksCacheKey);

    return updatedTask;
  }

  public async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.tasksRepository.deleteTask(userId, taskId);
    const cacheKey = `task:${taskId}:${userId}`;
    await this.cacheManager.del(cacheKey);
  }
}
