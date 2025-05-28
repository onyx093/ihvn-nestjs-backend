import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateNonStudentUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  userSetting?: CreateUserSettingDto;
}
