import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {
    // TODO POST /task (createTask) ++
    // TODO GET /task (getTask) ++
    // TODO GET /task/:id (getUserTaskById) ++
    // TODO PATCH /task/:id (updateTask) ++
    // TODO DELETE  /tasks/:id (deleteTask) ++
  }
}
