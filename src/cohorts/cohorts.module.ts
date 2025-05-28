import { Module } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { CohortsController } from './cohorts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cohort } from './entities/cohort.entity';
import { CASLModule } from '@/casl/casl.module';
import { LessonModule } from '@/lesson/lesson.module';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cohort, Course]),
    LessonModule,
    CASLModule,
  ],
  controllers: [CohortsController],
  providers: [CohortsService],
  exports: [CohortsService],
})
export class CohortModule {}
