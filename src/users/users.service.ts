import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from './entities/user-setting.entity';
import { hash } from 'argon2';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...others } = createUserDto;
    const hashedPassword = await hash(password);

    /* const userSetting = new UserSetting({
      ...createUserDto.userSetting,
      notificationsEnabled: true,
    }); */
    const user = this.userRepository.create({
      password: hashedPassword,
      ...others,
      /* userSetting,
      comments: [], */
    });
    const registeredUser = await this.userRepository.save(user);
    await this.emailQueue.add('sendWelcomeEmail', {
      email: user.email,
      name: user.name,
    }, {
      attempts: 3,
    });
    return registeredUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { userSetting: true, },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { userSetting: true, },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const updatedUser = { ...user, ...updateUserDto };
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { userSetting: true, },
    });
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const updatedUser = { ...user, hashedRefreshToken };
    return await this.userRepository.save(updatedUser);
  }
}
