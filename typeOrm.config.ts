import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserSetting } from './src/users/entities/user-setting.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from './src/roles/entities/role.entity';
import { Permission } from './src/permissions/entities/permission.entity';
import { Course } from './src/courses/entities/course.entity';
import { CohortCourse } from './src/cohort-courses/entities/cohort-course.entity';
import { Cohort } from './src/cohorts/entities/cohort.entity';
import { Attendance } from './src/attendance/entities/attendance.entity';
import { Account } from './src/users/entities/account.entity';
import { CourseSchedule } from './src/course-schedules/entities/course-schedule.entity';
import { Lesson } from './src/lesson/entities/lesson.entity';
import { Enrollment } from './src/enrollments/entities/enrollment.entity';
import { Student } from './src/students/entities/student.entity';
import { Instructor } from './src/instructors/entities/instructor.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),

  entities: [
    User,
    UserSetting,
    Role,
    Permission,
    Course,
    CohortCourse,
    Cohort,
    Attendance,
    Account,
    CourseSchedule,
    Lesson,
    Enrollment,
    Student,
    Instructor,
  ],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
});
