import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // private transporter;

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to IHVN',
        text: `Hello ${name}, welcome to IHVN!

        Here are your login credentials:
        Email: ${email}
        Password: ${password}

        Please change your password after logging in for the first time.
        
        We are thrilled to have you as part of our community. Your journey with us begins now, and we can't wait to see what you'll achieve.
        If you have any questions or need assistance, feel free to reach out to us.`,
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
