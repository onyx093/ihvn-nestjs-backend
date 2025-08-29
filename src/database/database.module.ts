import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Account } from '../users/entities/account.entity';
import { CohortCourse } from '../cohort-courses/entities/cohort-course.entity';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Role } from '../roles/entities/role.entity';
import { Student } from '../students/entities/student.entity';
import { CourseSchedule } from '../course-schedules/entities/course-schedule.entity';
import { UserSetting } from '../users/entities/user-setting.entity';
import { getDatabaseHost } from '../lib/util';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host:
          configService.getOrThrow('NODE_ENV') === 'production'
            ? `/cloudsql/${configService.getOrThrow('CLOUD_SQL_CONNECTION_NAME')}`
            : getDatabaseHost(),
        port:
          configService.getOrThrow('NODE_ENV') === 'production'
            ? undefined
            : configService.getOrThrow('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        ssl: false,
        autoLoadEntities: false,
        entities: [
          Account,
          Attendance,
          CohortCourse,
          Cohort,
          Course,
          CourseSchedule,
          Enrollment,
          Instructor,
          Lesson,
          Permission,
          Role,
          Student,
          User,
          UserSetting,
        ],
        synchronize: false,
        migrationsRun: configService.getOrThrow('RUN_MIGRATIONS'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
