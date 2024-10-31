import { CreateUserSettingDto } from './create-user-setting.dto';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  userSetting: CreateUserSettingDto;
}
