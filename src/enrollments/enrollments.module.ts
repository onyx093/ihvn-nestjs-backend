import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Enrollment } from './entities/enrollment.entity';
import { StudentsModule } from '@/students/students.module';
import { CohortsModule } from '@/cohorts/cohorts.module';
import { CohortCoursesModule } from '@/cohort-courses/cohort-courses.module';
import { CohortCourse } from '../cohort-courses/entities/cohort-course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, CohortCourse]),
    CohortsModule,
    StudentsModule,
    CohortCoursesModule,
    CASLModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
