import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Enrollment } from './entities/enrollment.entity';
import { StudentsModule } from '@/students/students.module';
import { CoursesModule } from '@/courses/courses.module';
import { CohortsModule } from '@/cohorts/cohorts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    CohortsModule,
    StudentsModule,
    forwardRef(() => CoursesModule),
    CASLModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
