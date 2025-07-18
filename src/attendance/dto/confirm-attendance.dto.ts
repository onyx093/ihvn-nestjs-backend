import { AttendanceStatus } from '@/enums/attendance.enum';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ConfirmAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsUUID()
  lessonId: string;

  // @IsEnum(AttendanceStatus)
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
