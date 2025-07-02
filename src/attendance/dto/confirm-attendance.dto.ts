import { AttendanceStatus } from '@/enums/attendance.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ConfirmAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
