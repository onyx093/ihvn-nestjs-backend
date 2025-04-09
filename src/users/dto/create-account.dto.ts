import { IsBoolean } from 'class-validator';

export class CreateAccountDto {
  @IsBoolean()
  firstTimeLogin: boolean;

  @IsBoolean()
  isAccountGenerated: boolean;
}
