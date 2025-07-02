import { AttendanceStatus } from '@/enums/attendance.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MarkAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  lessonId: string;

  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
