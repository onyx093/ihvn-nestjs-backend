import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoveryController } from './password-recovery.controller';
import { PasswordRecoveryService } from './password-recovery.service';

describe('Password Recovery', () => {
  let passwordRecoveryController: PasswordRecoveryController;
  let passwordRecoveryService: PasswordRecoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordRecoveryController],
      providers: [
        {
          provide: PasswordRecoveryService,
          useValue: {
            sendOtp: jest.fn(),
            verifyOtp: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    passwordRecoveryController = module.get<PasswordRecoveryController>(PasswordRecoveryController);
    passwordRecoveryService = module.get<PasswordRecoveryService>(PasswordRecoveryService);
  });

  it('should be defined', () => {
    expect(passwordRecoveryController).toBeDefined();
  });

  it('should send OTP', async () => {
    jest.spyOn(passwordRecoveryService, 'sendOtp').mockResolvedValue({ message: 'OTP sent to your email address' });

    const result = await passwordRecoveryController.sendOtp({ email: 'test@example.com' });

    expect(passwordRecoveryService.sendOtp).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result.message).toBe('OTP sent to your email address');
  });

  it('should verify OTP', async () => {
    jest.spyOn(passwordRecoveryService, 'verifyOtp').mockResolvedValue({ message: 'OTP verified successfully' });

    const result = await passwordRecoveryController.verifyOtp({ email: 'test@example.com', otp: '123456' });

    expect(passwordRecoveryService.verifyOtp).toHaveBeenCalledWith({ email: 'test@example.com', otp: '123456' });
    expect(result.message).toBe('OTP verified successfully');
  });

  it('should update password', async () => {
    jest.spyOn(passwordRecoveryService, 'updatePassword').mockResolvedValue({ message: 'Password updated successfully' });

    const result = await passwordRecoveryController.updatePassword({ email: 'test@example.com', newPassword: 'newPassword', confirmPassword: 'newPassword' });

    expect(passwordRecoveryService.updatePassword).toHaveBeenCalledWith({ email: 'test@example.com', newPassword: 'newPassword', confirmPassword: 'newPassword' });
    expect(result.message).toBe('Password updated successfully');
  });
});
