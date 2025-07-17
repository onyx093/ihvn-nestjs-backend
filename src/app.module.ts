import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { CoursesModule } from './courses/courses.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CohortsModule } from './cohorts/cohorts.module';
import { LessonModule } from './lesson/lesson.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { StudentsModule } from './students/students.module';
import { CourseSchedulesModule } from './course-schedules/course-schedules.module';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseExceptionFilter } from './exception-filters/database-exception.filter';
import { CohortCoursesModule } from './cohort-courses/cohort-courses.module';
import { InstructorsModule } from './instructors/instructors.module';

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
          pass: configService.getOrThrow('EMAIL_PASSWORD'),
        },
        // debug: true,
        // logger: true,
      },
      defaults: {
        from: '"No Reply" <no-reply@idnng.com>',
      },
      /* template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }, */
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    PasswordRecoveryModule,
    PermissionsModule,
    RolesModule,
    CoursesModule,
    AttendanceModule,
    FileUploadModule,
    CohortsModule,
    LessonModule,
    EnrollmentsModule,
    StudentsModule,
    CourseSchedulesModule,
    CohortCoursesModule,
    InstructorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter, // Apply globally
    },
  ],
  exports: [Logger],
})
export class AppModule {}
