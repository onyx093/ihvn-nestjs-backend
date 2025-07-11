import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { Lesson } from './entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { Course } from '../courses/entities/course.entity';
import { UsersModule } from '@/users/users.module';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Student } from '../students/entities/student.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      Course,
      Cohort,
      Instructor,
      Student,
      Attendance,
    ]),
    UsersModule,
    CASLModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
