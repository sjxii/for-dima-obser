import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { prioritiesEnum, statusEnum } from 'src/database/schema';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(prioritiesEnum)
  priority: 'High' | 'Low';

  @IsNotEmpty()
  @IsEnum(statusEnum)
  status: 'TODO' | 'In Progress' | 'Done';

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  categoryId?: string;
}
