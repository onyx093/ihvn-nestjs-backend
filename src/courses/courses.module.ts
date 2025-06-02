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

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
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
