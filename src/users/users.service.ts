import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Role } from '../roles/entities/role.entity';
import { PredefinedRoles } from '../enums/role.enum';
import errors from '@/config/errors.config';
import { Account } from './entities/account.entity';
import { generate } from 'generate-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectQueue('email') private readonly emailQueue: Queue
  ) {}

  async create(
    createUserDto: CreateUserDto,
    isGenerated?: boolean
  ): Promise<User> {
    const generatedPassword = generate({
      length: 12,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: false,
      strict: true,
    });
    console.log(generatedPassword);

    const hashedPassword = await hash(generatedPassword);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...createUserDto,
    });

    const studentRole = await this.roleRepository.findOneBy({
      name: PredefinedRoles.STUDENT,
    });
    user.roles = [studentRole];
    const registeredUser = await this.userRepository.save(user);

    if (!registeredUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const account = await this.accountRepository.create({
      firstTimeLogin: true,
      isAccountGenerated: isGenerated ? true : false,
      user: registeredUser,
    });
    await this.accountRepository.save(account);

    await this.emailQueue.add(
      'sendWelcomeEmail',
      {
        email: registeredUser.email,
        name: registeredUser.name,
        password: generatedPassword,
      },
      {
        attempts: 3,
      }
    );
    return registeredUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { account: true, userSetting: true, roles: true },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { account: true, userSetting: true, roles: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(errors.notFound('User not found'));
    }
    const updatedUser = { ...user, ...updateUserDto, updatedAt: new Date() };
    return await this.userRepository.save(updatedUser);
  }

  async updateSelfPasswordOnFirstLogin(
    userId: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<User> {
    if (!newPassword || !confirmPassword) {
      throw new BadRequestException(
        errors.validationFailed('Password and confirm password are required')
      );
    }
    if (newPassword.length < 8) {
      throw new BadRequestException(
        errors.validationFailed('Password must be at least 8 characters long')
      );
    }
    if (!/[a-z]/.test(newPassword)) {
      throw new BadRequestException(
        errors.validationFailed(
          'Password must contain at least one lowercase letter'
        )
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      throw new BadRequestException(
        errors.validationFailed(
          'Password must contain at least one uppercase letter'
        )
      );
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new BadRequestException(
        errors.validationFailed('Password must contain at least one number')
      );
    }

    console.log('user id: ', userId);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(errors.notFound('User not found'));
    }
    let userAccount = await this.accountRepository.findOneBy({
      user: { id: userId },
    });
    userAccount.firstTimeLogin = false;
    userAccount = await this.accountRepository.save(userAccount);

    const hashedPassword = await hash(newPassword);
    const updatedUser = {
      ...user,
      password: hashedPassword,
      account: userAccount,
      updatedAt: new Date(),
    };

    return await this.userRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    const roles = await this.roleRepository.findByIds(roleIds);
    user.roles = roles;
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { account: true, userSetting: true },
    });
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const updatedUser = { ...user, hashedRefreshToken };
    return await this.userRepository.save(updatedUser);
  }
}
