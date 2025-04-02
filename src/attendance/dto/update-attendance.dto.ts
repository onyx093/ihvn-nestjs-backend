import { IsNotEmpty } from 'class-validator';

export class UpdateAttendanceDto {
  @IsNotEmpty()
  attendanceId: string;
}
