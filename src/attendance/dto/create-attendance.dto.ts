import { WeekType } from '@/enums/attendance.enum';
import { IsNotEmpty, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  userId: string;

  // Record date in YYYY-MM-DD format.
  @IsDateString()
  date: string;

  // Optional clock in time (if not provided, the service can set the current time)
  clockIn?: Date;

  @IsEnum(WeekType)
  weekType?: WeekType;
}
