import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskSelectModel } from './task.repository';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createTask(
    @CurrentUser() user,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<void> {
    await this.tasksService.createTask({ ...createTaskDto, userId: user.id });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getTasks(
    @CurrentUser() user,
    @Query('category') categoryId?: string,
    @Query('status') status?: 'TODO' | 'In Progress' | 'Done',
  ): Promise<TaskSelectModel[]> {
    return await this.tasksService.getTasks(user.id, categoryId, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUserTaskById(
    @Param('id') id: string,
    @CurrentUser() user,
  ): Promise<TaskSelectModel> {
    return await this.tasksService.getUserTaskById(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskSelectModel> {
    return await this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteTask(
    @Param('id') id: string,
    @CurrentUser() user,
  ): Promise<void> {
    return await this.tasksService.deleteTask(user.id, id);
  }
}
