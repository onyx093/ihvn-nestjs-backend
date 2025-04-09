import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateUserSettingDto } from './create-user-setting.dto';
import { CreateAccountDto } from './create-account.dto';

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
  @IsOptional()
  phoneNumber?: string;

  account?: CreateAccountDto;

  userSetting?: CreateUserSettingDto;
}
