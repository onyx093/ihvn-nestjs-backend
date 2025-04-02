import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsOptional()
  guest: string;

  @IsString()
  @IsOptional()
  description: string;
}
