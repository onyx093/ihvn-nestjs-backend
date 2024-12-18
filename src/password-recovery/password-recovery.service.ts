import { User } from '@/users/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectQueue('email') private readonly emailQueue: Queue,
    ) { }

    async sendOtp(sendOtpDto: SendOtpDto) {
        const { email } = sendOtpDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        if (new Date() < user.otpExpiry) {
            await this.emailQueue.add('sendOTPEmail', {
                email: user.email,
                otp: user.otp,
            }, {
                attempts: 3,
            });

            return { message: 'OTP sent to your email address', otp: user.otp };
        }

        const { otp, expiry } = this.generateOTP(10);

        user.otp = otp;
        user.otpExpiry = expiry;
        await this.userRepository.save(user);

        // Queue email job
        await this.emailQueue.add('sendOTPEmail', {
            email: user.email,
            name: user.name,
        }, {
            attempts: 3,
        });

        return { message: 'OTP sent to your email address', otp };
    }

    async verifyOtp(verifyOtp: VerifyOtpDto) {
        const { email, otp } = verifyOtp;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || user.otp !== otp) throw new BadRequestException('Invalid OTP');

        if (new Date() > user.otpExpiry) throw new BadRequestException('OTP has expired');

        return { message: 'OTP verified successfully' };
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto) {
        const { email, newPassword, confirmPassword } = updatePasswordDto;
        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Incorrect password confirmation')
        }

        const hashedPassword = await hash(newPassword);
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await this.userRepository.save(user);

        return { message: 'Password updated successfully' };
    }

    generateOTP(time) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + time * 60 * 1000); // OTP valid for 10 minutes
        return { otp, expiry };
    }
}
