import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Queue } from 'bull';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import * as argon2 from 'argon2';

jest.mock('argon2');

/* describe('UsersService', () => {
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
}); */

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: any;
  let roleRepo: any;

  beforeEach(() => {
    userRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    roleRepo = {
      findByIds: jest.fn(),
    };

    service = new UsersService(userRepo, roleRepo);
  });

  it('should create a new user', async () => {
    const dto = { username: 'john', email: 'john@example.com' };
    const createdUser = { id: 1, ...dto };
    userRepo.create.mockReturnValue(createdUser);
    userRepo.save.mockResolvedValue(createdUser);

    const result = await service.create(dto);
    expect(userRepo.create).toHaveBeenCalledWith(dto);
    expect(userRepo.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(createdUser);
  });

  it('should find all users with roles', async () => {
    const users = [{ id: 1, username: 'john', roles: [] }];
    userRepo.find.mockResolvedValue(users);

    const result = await service.findAll();
    expect(userRepo.find).toHaveBeenCalledWith({ relations: ['roles'] });
    expect(result).toEqual(users);
  });

  it('should find one user with roles', async () => {
    const user = { id: 1, username: 'john', roles: [] };
    userRepo.findOne.mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['roles'],
    });
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const dto = { username: 'updated' };
    userRepo.update.mockResolvedValue({});
    userRepo.findOne.mockResolvedValue({ id: 1, ...dto, roles: [] });

    const result = await service.update(1, dto);
    expect(userRepo.update).toHaveBeenCalledWith(1, dto);
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['roles'],
    });
    expect(result).toEqual({ id: 1, ...dto, roles: [] });
  });

  it('should delete a user', async () => {
    userRepo.delete.mockResolvedValue({});
    await service.remove(1);
    expect(userRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should assign roles to a user', async () => {
    const user = { id: 1, username: 'john', roles: [] };
    const roles = [{ id: 1, name: 'Admin' }];
    userRepo.findOne.mockResolvedValue(user);
    roleRepo.findByIds.mockResolvedValue(roles);
    userRepo.save.mockResolvedValue({ ...user, roles });

    const result = await service.assignRoles(1, [1]);
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['roles'],
    });
    expect(roleRepo.findByIds).toHaveBeenCalledWith([1]);
    expect(userRepo.save).toHaveBeenCalledWith({ ...user, roles });
    expect(result).toEqual({ ...user, roles });
  });
});
