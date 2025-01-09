import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import errors from '@/config/errors.config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    if (isEmpty(password)) {
      throw new UnauthorizedException(
        errors.authenticationFailed('Password is required')
      );
    }
    return await this.authService.validateLocalUser(email, password);
  }
}
