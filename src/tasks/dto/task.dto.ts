import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsNotEmpty()
  @IsEnum(prioritiesEnum)
  priority: 'High' | 'Low';

  @IsNotEmpty()
  @IsEnum(statusEnum)
  status: 'TODO' | 'In Progress' | 'Done';

  userId: string;
}
