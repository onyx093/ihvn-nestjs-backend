import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentUserDto } from './create-student-user.dto';

export class UpdateStudentUserDto extends PartialType(CreateStudentUserDto) {}
