import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Queue } from 'bull';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let emailQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mock<Repository<User>>(),
        },
        {
          provide: 'BullQueue_email',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    emailQueue = module.get<Queue>('BullQueue_email');
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should register a new user and enqueue email job', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };
    const hashedPassword = mockUser.password;

    (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'create').mockReturnValue(mockUser as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as any);

    const result = await usersService.create(mockUser);

    expect(argon2.hash).toHaveBeenCalledWith(mockUser.password);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(emailQueue.add).toHaveBeenCalledWith('sendWelcomeEmail', {
      email: mockUser.email,
      name: mockUser.name,
    });
    expect(result).toEqual(mockUser);
  });
});
