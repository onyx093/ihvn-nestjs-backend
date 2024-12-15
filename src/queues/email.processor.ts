import { Process, Processor } from "@nestjs/bull";
import { EmailService } from "./email.service";
import { Job } from "bull";

@Processor('email')
export class EmailProcessor {
    constructor(private readonly emailService: EmailService) { }

    @Process('sendWelcomeEmail')
    async handleSendEmail(job: Job) {
        const { email, name } = job.data;
        console.log(`Sending an email to ${email}`);
        await this.emailService.sendWelcomeEmail(email, name);
        console.log(`Email sent!`);

    }
}