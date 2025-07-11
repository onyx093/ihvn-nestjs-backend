import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CASLModule } from '@/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { InstructorsModule } from '@/instructors/instructors.module';
import { UsersModule } from '@/users/users.module';
import { CohortsModule } from '@/cohorts/cohorts.module';
import { CohortCoursesModule } from '@/cohort-courses/cohort-courses.module';
import { EnrollmentsModule } from '@/enrollments/enrollments.module';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Lesson } from '../lesson/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Enrollment,
      Student,
      Instructor,
      Attendance,
      Lesson,
    ]),
    InstructorsModule,
    UsersModule,
    CohortsModule,
    CohortCoursesModule,
    EnrollmentsModule,
    CASLModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
