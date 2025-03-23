import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  category: string;
}
