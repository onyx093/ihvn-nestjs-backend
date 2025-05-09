import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsUrl()
  thumbnail: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  estimatedDurationForCompletion: number;
}
