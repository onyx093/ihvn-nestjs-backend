import { AttendanceStatus } from '@/enums/attendance.enum';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  lessonId: string;

  // @IsEnum(AttendanceStatus)
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
