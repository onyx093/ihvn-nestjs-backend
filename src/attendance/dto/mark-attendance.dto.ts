import { AttendanceStatus } from '@/enums/attendance.enum';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class MarkAttendanceDto {
  @IsUUID()
  lessonId: string;

  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
