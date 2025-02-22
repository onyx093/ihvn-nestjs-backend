import { IsEmail, IsString } from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  userSetting?: CreateUserSettingDto;
}
