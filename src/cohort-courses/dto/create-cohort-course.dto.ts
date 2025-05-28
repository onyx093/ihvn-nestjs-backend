import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCohortCourseDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
