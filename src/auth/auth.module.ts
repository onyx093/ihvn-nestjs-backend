import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JWTStrategy } from './strategies/jwt.strategy';
import refreshConfig from './config/refresh.config';
import { RefreshStrategy } from './strategies/refresh.strategy';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy,
    RefreshStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
