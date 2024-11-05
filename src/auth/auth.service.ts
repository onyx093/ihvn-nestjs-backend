import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { verify } from 'argon2';
import { AuthJWTPayload } from './types/auth-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('A user already exist with this email');
    }

    return await this.userService.create(createUserDto);
  }

  async login(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatched = await verify(user.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, name: user.name };
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
      throw new UnauthorizedException('User not found!');
    }

    const currentUser = {
      id: user.id,
    };

    return currentUser;
  }

  async validateRefreshToken(userId: number) {
    const user = await this.userService.findOne(`${userId}`);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const currentUser = {
      id: user.id,
    };

    return currentUser;
  }

  async refreshToken(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
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
}
