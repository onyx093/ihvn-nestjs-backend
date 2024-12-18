import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoveryService } from './password-recovery.service';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Queue } from 'bull';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Password Recovery', () => {
  let passwordRecoveryService: PasswordRecoveryService;
  let userRepository: Repository<User>;
  let emailQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordRecoveryService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'BullQueue_email',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    passwordRecoveryService = module.get<PasswordRecoveryService>(PasswordRecoveryService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    emailQueue = module.get<Queue>('BullQueue_email');
  });

  it('should be defined', () => {
    expect(passwordRecoveryService).toBeDefined();
  });

  it('should send OTP to user email', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe', otp: null, otpExpiry: null };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as any);

    const result = await passwordRecoveryService.sendOtp({ email: 'test@example.com' });

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(emailQueue.add).toHaveBeenCalled();
    expect(result.message).toBe('OTP sent to your email address');
  });

  it('should verify the OTP', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      otp: '123456',
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);

    const result = await passwordRecoveryService.verifyOtp({ email: 'test@example.com', otp: '123456' });

    expect(result.message).toBe('OTP verified successfully');
  });

  it('should update the password', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'oldPassword' };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as any);

    const result = await passwordRecoveryService.updatePassword({ email: 'test@example.com', newPassword: 'newPassword', confirmPassword: 'newPassword' });

    expect(userRepository.save).toHaveBeenCalled();
    expect(result.message).toBe('Password updated successfully');
  });
});
