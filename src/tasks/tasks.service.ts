import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/task.dto';
import { TaskInsertModel, TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async createTask(task: TaskInsertModel): Promise<void> {
    await this.tasksRepository.createTask(task);
  }

  public async getTasks(userId: string, categoryId?: string, status?: string) {
    return await this.tasksRepository.getTasks(userId, categoryId, status);
  }

  public async getUserTaskById(taskId: string, userId: string) {
    const task = await this.tasksRepository.getUserTaskById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

    return task;
  }

  public async updateTask(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const updatedTask = await this.tasksRepository.updateTask(
      taskId,
      userId,
      updateTaskDto,
    );

    if (!updatedTask) {
      throw new NotFoundException('Task not found or you are not the owner');
    }

    return updatedTask;
  }

  public async deleteTask(userId: string, taskId: string): Promise<void> {
    const result = await this.tasksRepository.deleteTask(userId, taskId);

    if (!result) {
      throw new NotFoundException('Task not found or you are not the owner');
    }
  }
}
