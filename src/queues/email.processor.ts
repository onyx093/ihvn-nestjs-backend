import { Process, Processor } from "@nestjs/bull";
import { EmailService } from "./email.service";
import { Job } from "bull";

@Processor('email')
export class EmailProcessor {
    constructor(private readonly emailService: EmailService) { }



    @Process('sendWelcomeEmail')
    async handleWelcomeEmail(job: Job) {
        try {
            const { email, name } = job.data;
            console.log(`Sending an email to ${email}`);
            await this.emailService.sendWelcomeEmail(email, name);
            console.log(`Email sent!`);
        } catch (error) {
            console.error(`Failed to send email for job ${job.id}:`, error);
            throw error;
        }

    }

    @Process('sendOTPEmail')
    async handleOTPEmail(job: Job) {
        try {
            const { email, otp } = job.data;
            console.log(`Sending an otp: ${otp} to ${email}`);
            await this.emailService.sendOTPEmail(email, otp);
            console.log(`Email sent!`);
        } catch (error) {
            console.error(`Failed to send email for job ${job.id}:`, error);
            throw error;
        }

    }
}