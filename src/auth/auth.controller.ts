import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { CreateStudentUserDto } from '@/users/dto/create-student-user.dto';
// import { Role } from '../enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createStudentUserDto: CreateStudentUserDto) {
    return this.authService.register(createStudentUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Body() body, @Request() req) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getAll(@Request() req) {
    return {
      message: `Now, you can access this protected route. This is your user ID: ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @HttpCode(HttpStatus.OK)
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  async googleCallback(@Request() req, @Res() res: Response) {
    const response = await this.authService.login(req.user.id, req.user.name);
    res.redirect(
      `${process.env.FRONTEND_URL}/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`
    );
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}
