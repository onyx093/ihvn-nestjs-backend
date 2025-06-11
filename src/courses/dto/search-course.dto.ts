import { CourseStatus } from '@/enums/course-status.enum';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchCourseDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  cohortId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class CourseResponseDto {
  id: string;
  name: string;
  description: string;
  status: CourseStatus;
  estimatedDurationForCompletion: number;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class StudentCourseSearchResponseDto {
  enrolledCourses: CourseResponseDto[];
  availableCourses: CourseResponseDto[];
}

export class InstructorCourseSearchResponseDto {
  assignedCourses: CourseResponseDto[];
  otherCourses?: CourseResponseDto[];
}

export class AdminCourseSearchResponseDto {
  draftCourses: CourseResponseDto[];
  publishedCourses: CourseResponseDto[];
}

export type CourseSearchResponseDto =
  | StudentCourseSearchResponseDto
  | InstructorCourseSearchResponseDto
  | AdminCourseSearchResponseDto;
