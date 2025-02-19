import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // private transporter;

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our App',
        text: `Hello ${name}, welcome to our app!`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }

  async sendOTPEmail(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Recovery OTP',
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }
}
