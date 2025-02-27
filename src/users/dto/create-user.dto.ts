import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  userSetting?: CreateUserSettingDto;
}
