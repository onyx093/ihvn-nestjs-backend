import { PartialType } from '@nestjs/mapped-types';
import { CreateNonStudentUserDto } from './create-non-student-user.dto';

export class UpdateNonStudentUserDto extends PartialType(
  CreateNonStudentUserDto
) {}
