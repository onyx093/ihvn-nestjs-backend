import { Student } from './src/students/entities/student.entity';
import { Instructor } from './src/instructors/entities/instructor.entity';
import { Role } from './src/roles/entities/role.entity';
import { UserSetting } from './src/users/entities/user-setting.entity';
import { User } from './src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { SeederOptions } from 'typeorm-extension';
import { Enrollment } from './src/enrollments/entities/enrollment.entity';
import { Lesson } from './src/lesson/entities/lesson.entity';
import { CourseSchedule } from './src/course-schedules/entities/course-schedule.entity';
import { Cohort } from './src/cohorts/entities/cohort.entity';
import { Account } from './src/users/entities/account.entity';
import { Attendance } from './src/attendance/entities/attendance.entity';
import { CohortCourse } from './src/cohort-courses/entities/cohort-course.entity';
import { Course } from './src/courses/entities/course.entity';
import { Permission } from './src/permissions/entities/permission.entity';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: configService.getOrThrow('DATASOURCE_URL'),
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),

  seeds: ['src/database/seeders/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
  entities: [
    User,
    UserSetting,
    Role,
    Permission,
    Course,
    CohortCourse,
    Attendance,
    Account,
    Cohort,
    CourseSchedule,
    Lesson,
    Enrollment,
    Student,
    Instructor,
  ],
};

export const dataSource = new DataSource(options);
