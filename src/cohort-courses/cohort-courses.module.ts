import { Module } from '@nestjs/common';
import { CohortCoursesService } from './cohort-courses.service';
import { CohortCoursesController } from './cohort-courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortCourse } from './entities/cohort-course.entity';
import { CASLModule } from '@/casl/casl.module';
import { CohortModule } from '@/cohorts/cohorts.module';
import { CoursesModule } from '@/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CohortCourse]),
    CohortModule,
    CoursesModule,
    CASLModule,
  ],
  controllers: [CohortCoursesController],
  providers: [CohortCoursesService],
})
export class CohortCoursesModule {}
