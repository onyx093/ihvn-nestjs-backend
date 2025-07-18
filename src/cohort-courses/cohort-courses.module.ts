import { forwardRef, Module } from '@nestjs/common';
import { CohortCoursesService } from './cohort-courses.service';
import { CohortCoursesController } from './cohort-courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortCourse } from './entities/cohort-course.entity';
import { CASLModule } from '../casl/casl.module';
import { CohortsModule } from '../cohorts/cohorts.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CohortCourse]),
    CohortsModule,
    forwardRef(() => CoursesModule),
    CASLModule,
  ],
  controllers: [CohortCoursesController],
  providers: [CohortCoursesService],
  exports: [CohortCoursesService],
})
export class CohortCoursesModule {}
