import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BullModule.forRoot({
      redis: {
        host: configService.getOrThrow('REDIS_HOST'),
        port: configService.getOrThrow('REDIS_PORT'),
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: configService.getOrThrow('EMAIL_HOST'),
        port: configService.getOrThrow('EMAIL_PORT'),
        secure: false,
        auth: {
          user: configService.getOrThrow('EMAIL_USERNAME'),
          pass: configService.getOrThrow('EMAIL_PASSWORD')
        }
      },
      defaults: {
        from: '"No Reply" <no-reply@idnng.com>'
      },
      /* template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }, */
    }),
    UsersModule,
    AuthModule,
    PasswordRecoveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
