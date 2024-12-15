import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: configService.getOrThrow('EMAIL_SERVICE'),
            auth: {
                user: this.configService.getOrThrow('EMAIL_USERNAME'),
                pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
            },
        });
    }

    async sendWelcomeEmail(email: string, name: string) {
        await this.transporter.sendMail({
            from: this.configService.getOrThrow('EMAIL_USERNAME'),
            to: email,
            subject: 'Welcome to Our App',
            text: `Hello ${name}, welcome to our app!`,
        });
    }
}