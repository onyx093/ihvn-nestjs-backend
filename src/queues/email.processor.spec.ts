import { Test, TestingModule } from "@nestjs/testing";
import { EmailProcessor } from "./email.processor";
import { EmailService } from "./email.service";

jest.mock('nodemailer');

describe('EmailProcessor', () => {
    let emailProcessor: EmailProcessor;
    let emailService: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailProcessor,
                {
                    provide: EmailService,
                    useValue: {
                        sendWelcomeEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        emailProcessor = module.get<EmailProcessor>(EmailProcessor);
        emailService = module.get<EmailService>(EmailService);

    });

    it('should process email job and send email', async () => {
        const mockJob = {
            data: { email: 'john@example.com', name: 'John Doe' },
        };

        await emailProcessor.handleSendEmail(mockJob as any);

        expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('john@example.com', 'John Doe');
    });
});