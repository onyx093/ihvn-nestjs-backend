import 'reflect-metadata';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { UserSetting } from '@/users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Event } from '../events/entities/event.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Account } from '../users/entities/account.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { CourseSchedule } from '../course-schedules/entities/course-schedule.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { ActiveCourse } from '../active-courses/entities/active-course.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URL'),
        autoLoadEntities: false,
        entities: [
          User,
          UserSetting,
          Role,
          Permission,
          ActiveCourse,
          Course,
          Event,
          Attendance,
          Account,
          Lesson,
          CourseSchedule,
          Enrollment,
          Student,
          Cohort,
        ],
        synchronize: configService.getOrThrow('SYNCHRONIZE'),
        migrationsRun: configService.getOrThrow('RUN_MIGRATIONS'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
