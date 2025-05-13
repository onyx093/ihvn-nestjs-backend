import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CASLModule } from '@/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseCategoryService } from '@/course-categories/course-category.service';
import { CourseCategory } from '../course-categories/entities/course-category.entity';
import { CourseCategoryModule } from '@/course-categories/course-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseCategory]),
    CASLModule,
    CourseCategoryModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CourseCategoryService],
})
export class CoursesModule {}
