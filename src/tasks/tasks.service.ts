import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/task.dto';
import {
  TaskInsertModel,
  TaskSelectModel,
  TasksRepository,
} from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async createTask(task: TaskInsertModel): Promise<void> {
    await this.tasksRepository.createTask(task);
  }

  public async getTasks(
    userId: string,
    categoryId?: string,
    status?: 'TODO' | 'In Progress' | 'Done',
  ): Promise<TaskSelectModel[]> {
    return await this.tasksRepository.getTasks(userId, categoryId, status);
  }

  public async getUserTaskById(
    taskId: string,
    userId: string,
  ): Promise<TaskSelectModel> {
    const task = await this.tasksRepository.getUserTaskById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

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

    return updatedTask;
  }

  public async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.tasksRepository.deleteTask(userId, taskId);
  }
}
