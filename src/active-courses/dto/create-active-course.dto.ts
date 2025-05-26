import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateActiveCourseDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
