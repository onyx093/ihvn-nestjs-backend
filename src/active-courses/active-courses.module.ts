import { Module } from '@nestjs/common';
import { ActiveCoursesService } from './active-courses.service';
import { ActiveCoursesController } from './active-courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveCourse } from './entities/active-course.entity';
import { CASLModule } from '@/casl/casl.module';
import { CohortModule } from '@/cohorts/cohorts.module';
import { CoursesModule } from '@/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveCourse]),
    CohortModule,
    CoursesModule,
    CASLModule,
  ],
  controllers: [ActiveCoursesController],
  providers: [ActiveCoursesService],
})
export class ActiveCoursesModule {}
