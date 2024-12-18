import { IsEmail, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    newPassword: string;

    @IsString()
    confirmPassword: string;
}