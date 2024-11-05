import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from './entities/user-setting.entity';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...others } = createUserDto;
    const hashedPassword = await hash(password);

    const userSetting = new UserSetting({
      ...createUserDto.userSetting,
      notificationsEnabled: true,
    });
    const user = new User({
      password: hashedPassword,
      ...others,
      userSetting,
      comments: [],
    });
    return await this.entityManager.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { userSetting: true, comments: true },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { userSetting: true, comments: true },
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
      relations: { userSetting: true, comments: true },
    });
  }
}
