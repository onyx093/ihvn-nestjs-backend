import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID, ValidateNested } from 'class-validator';

class DateRangeDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class GetAttendanceListDto {
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;
}
