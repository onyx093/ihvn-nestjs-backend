import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveCourseDto } from './create-active-course.dto';

export class UpdateActiveCourseDto extends PartialType(CreateActiveCourseDto) {}
