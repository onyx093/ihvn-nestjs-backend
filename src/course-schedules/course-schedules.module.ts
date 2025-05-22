import { Module } from '@nestjs/common';
import { CourseSchedulesService } from './course-schedules.service';
import { CourseSchedulesController } from './course-schedules.controller';
import { CourseSchedule } from './entities/course-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSchedule, Course]), CASLModule],
  controllers: [CourseSchedulesController],
  providers: [CourseSchedulesService],
})
export class CourseSchedulesModule {}
