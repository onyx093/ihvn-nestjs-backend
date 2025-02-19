import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '@/auth/decorators/public.decorator';

@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService
  ) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.passwordRecoveryService.sendOtp(sendOtpDto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.passwordRecoveryService.verifyOtp(verifyOtpDto);
  }

  @Public()
  @Post('update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordRecoveryService.updatePassword(updatePasswordDto);
  }
}
