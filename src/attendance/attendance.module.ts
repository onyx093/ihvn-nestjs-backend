import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { DiscoveryModule } from '@nestjs/core';
import { Student } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { InstructorsModule } from '@/instructors/instructors.module';
import { CohortsModule } from '@/cohorts/cohorts.module';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([Attendance, Student, Lesson, Enrollment, Course]),
    CASLModule,
    InstructorsModule,
    CohortsModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
