import { IsEmail, IsString } from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  userSetting: CreateUserSettingDto;
}
