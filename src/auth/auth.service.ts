import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hash, verify } from 'argon2';
import { AuthJWTPayload } from './types/auth-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { AuthCredentialsSchema } from '../schemas/auth.schema';
import { ZodError } from 'zod';
import errors from '../config/errors.config';
import { CreateStudentUserDto } from '../users/dto/create-student-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>
  ) {}

  async register(createStudentUserDto: CreateStudentUserDto) {
    const existingUser = await this.userService.findByEmail(
      createStudentUserDto.email
    );
    if (existingUser) {
      throw new ConflictException(
        errors.conflictError('A user with this email already exists')
      );
    }

    return await this.userService.createStudentUser(createStudentUserDto);
  }

  async login(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    const user = await this.userService.updateHashedRefreshToken(
      `${userId}`,
      hashedRefreshToken
    );
    return {
      ...user,
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async validateLocalUser(email: string, password: string) {
    try {
      AuthCredentialsSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = errors.formatZodErrors(error);

        throw new BadRequestException(
          errors.validationFailedWithFieldErrors(formattedErrors)
        );
      }

      throw error;
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('User not found!')
      );
    }

    const isPasswordMatched = await verify(user.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('Invalid credentials')
      );
    }

    return { id: user.id, name: user.name, role: user.roles };
  }

  async generateTokens(userId: number) {
    const payload: AuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async validateJWTUser(userId: number) {
    const user = await this.userService.findOne(`${userId}`);
    if (!user) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('User not found!')
      );
    }

    const currentUser = {
      id: user.id,
      roles: user.roles,
    };

    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(`${userId}`);
    if (!user) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('User not found!')
      );
    }

    const isRefreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken
    );
    if (!isRefreshTokenMatched) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('Invalid Refresh Token!')
      );
    }
    const currentUser = {
      id: user.id,
    };

    return currentUser;
  }

  async refreshToken(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(
      `${userId}`,
      hashedRefreshToken
    );
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return user;
    }

    return await this.userService.create(googleUser);
  }

  async signOut(userId: string) {
    const result = await this.userService.updateHashedRefreshToken(
      userId,
      null
    );
    return result;
  }
}
