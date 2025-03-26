import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from './categories.repository';
import { TasksRepository } from './task.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController, TasksController],
  providers: [
    CategoriesService,
    TasksService,
    CategoryRepository,
    TasksRepository,
  ],
})
export class TasksModule {}
