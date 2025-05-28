import { PartialType } from '@nestjs/mapped-types';
import { CreateCohortCourseDto } from './create-cohort-course.dto';

export class UpdateCohortCourseDto extends PartialType(CreateCohortCourseDto) {}
