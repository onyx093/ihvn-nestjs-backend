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
import { Student } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { CreateStudentUserDto } from './dto/create-student-user.dto';
import { CreateNonStudentUserDto } from './dto/create-non-student-user.dto';
import { Instructor } from '@/instructors/entities/instructor.entity';

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

    const hashedPassword = await hash(generatedPassword);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...createUserDto,
    });

    const newUser = await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.create(User, {
          password: hashedPassword,
          ...createUserDto,
        });

        await transactionalEntityManager.save(user);

        const studentRole = await this.roleRepository.findOneBy({
          name: PredefinedRoles.STUDENT,
        });
        user.roles = [studentRole];

        const account = await transactionalEntityManager.create(Account, {
          firstTimeLogin: true,
          isAccountGenerated: isGenerated ? true : false,
          user,
        });

        const student = await transactionalEntityManager.create(Student, {
          user,
        });

        const enrollment = await transactionalEntityManager.create(Enrollment, {
          student: user,
        });

        await Promise.all([
          transactionalEntityManager.save(account),
          transactionalEntityManager.save(enrollment),
          transactionalEntityManager.save(student),
        ]);

        return user;
      }
    );

    await this.emailQueue.add(
      'sendWelcomeEmail',
      {
        email: newUser.email,
        name: newUser.name,
        password: generatedPassword,
      },
      {
        attempts: 3,
      }
    );
    return newUser;
  }

  async createStudentUser(
    createStudentUserDto: CreateStudentUserDto,
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

    const hashedPassword = await hash(generatedPassword);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...createStudentUserDto,
    });

    const newUser = await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.create(User, {
          password: hashedPassword,
          ...createStudentUserDto,
        });

        await transactionalEntityManager.save(user);

        const studentRole = await this.roleRepository.findOneBy({
          name: PredefinedRoles.STUDENT,
        });
        user.roles = [studentRole];

        const account = await transactionalEntityManager.create(Account, {
          firstTimeLogin: true,
          isAccountGenerated: isGenerated ? true : false,
          user,
        });

        const student = await transactionalEntityManager.create(Student, {
          user,
        });

        const enrollment = await transactionalEntityManager.create(Enrollment, {
          student: user,
        });

        await Promise.all([
          transactionalEntityManager.save(user),
          transactionalEntityManager.save(account),
          transactionalEntityManager.save(enrollment),
          transactionalEntityManager.save(student),
        ]);

        return user;
      }
    );

    await this.emailQueue.add(
      'sendWelcomeEmail',
      {
        email: newUser.email,
        name: newUser.name,
        password: generatedPassword,
      },
      {
        attempts: 3,
      }
    );
    return newUser;
  }

  async createNonStudentUser(
    createNonStudentUserDto: CreateNonStudentUserDto,
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

    const hashedPassword = await hash(generatedPassword);

    const user = this.userRepository.create({
      password: hashedPassword,
      ...createNonStudentUserDto,
    });

    const newUser = await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.create(User, {
          password: hashedPassword,
          ...createNonStudentUserDto,
        });

        await transactionalEntityManager.save(user);

        const userRole = await this.roleRepository.findOneBy({
          id: createNonStudentUserDto.roleId,
        });

        if (!userRole) {
          throw new NotFoundException(errors.notFound('Role not found'));
        }
        user.roles = [userRole];

        const account = await transactionalEntityManager.create(Account, {
          firstTimeLogin: true,
          isAccountGenerated: isGenerated ? true : false,
          user,
        });

        if (userRole.name === PredefinedRoles.INSTRUCTOR) {
          const instructor = await transactionalEntityManager.create(
            Instructor,
            {
              user,
            }
          );

          await transactionalEntityManager.save(instructor);
        }

        await Promise.all([
          transactionalEntityManager.save(user),
          transactionalEntityManager.save(account),
        ]);

        return user;
      }
    );

    await this.emailQueue.add(
      'sendWelcomeEmail',
      {
        email: newUser.email,
        name: newUser.name,
        password: generatedPassword,
      },
      {
        attempts: 3,
      }
    );
    return newUser;
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
