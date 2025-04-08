import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { prioritiesEnum, statusEnum } from 'src/database/schema';

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(prioritiesEnum)
  priority: 'High' | 'Low';

  @IsOptional()
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
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsEnum(prioritiesEnum)
  priority: 'High' | 'Low';

  @IsEnum(statusEnum)
  status: 'TODO' | 'In Progress' | 'Done';
}
