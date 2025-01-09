import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSetting } from './entities/user-setting.entity';
import { Role } from '../../src/enums/role.enum';
import { INestApplication } from '@nestjs/common';
import { Queue } from 'bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { UsersModule } from './users.module';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../queues/email.module';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should register a new user', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      createdAt: undefined,
      updatedAt: undefined,
      userSetting: new UserSetting({}),
      role: Role.GUEST,
      id: '',
    };
    jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

    const result = await usersController.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
    });

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
    });
    expect(result).toEqual(mockUser);
  });
});

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let emailQueue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost', // PostgreSQL host
          port: 5432, // PostgreSQL port
          username: 'testuser', // PostgreSQL username
          password: 'testpassword', // PostgreSQL password
          database: 'testdb', // Test database name
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true, // Sync schema (use only in tests)
        }),
        BullModule.forRoot({
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
        UsersModule,
        EmailModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    emailQueue = moduleFixture.get<Queue>(getQueueToken('email'));

    await app.init();
    await app.listen(5000, () => {});
    console.log(await app.getUrl());
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/auth/register (POST)', async () => {
    const data = {
      name: 'John Doe',
      email: 'olaleyeobidiya@gmail.com',
      password: 'password123',
    };

    jest.spyOn(emailQueue, 'add');

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(data)
      .expect(201);

    expect(response.body).toMatchObject({
      name: data.name,
      email: data.email,
    });

    expect(emailQueue.add).toHaveBeenCalledWith('sendWelcomeEmail', {
      email: data.email,
      name: data.name,
    });
  });
});
