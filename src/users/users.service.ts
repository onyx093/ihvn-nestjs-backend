import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectQueue('email') private readonly emailQueue: Queue
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...others } = createUserDto;
    const hashedPassword = await hash(password);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...others,
    });

    const guestRole = await this.roleRepository.findOneBy({
      name: PredefinedRoles.GUEST,
    });
    user.roles = [guestRole];
    const registeredUser = await this.userRepository.save(user);
    await this.emailQueue.add(
      'sendWelcomeEmail',
      {
        email: registeredUser.email,
        name: registeredUser.name,
      },
      {
        attempts: 3,
      }
    );
    return registeredUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { userSetting: true, roles: true },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { userSetting: true, roles: true },
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
      relations: { userSetting: true },
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
