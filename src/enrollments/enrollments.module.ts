import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Enrollment } from './entities/enrollment.entity';
import { StudentsModule } from '@/students/students.module';
import { CoursesModule } from '@/courses/courses.module';
import { CohortModule } from '@/cohorts/cohorts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    StudentsModule,
    CoursesModule,
    CohortModule,
    CASLModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
