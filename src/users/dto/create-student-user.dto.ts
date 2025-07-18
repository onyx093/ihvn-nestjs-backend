import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateStudentUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  /*   @IsNotEmpty()
  @IsString()
  @IsUUID()
  cohortId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  courseId: string; */

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  userSetting?: CreateUserSettingDto;
}
