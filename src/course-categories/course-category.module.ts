import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryController } from './course-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategory } from './entities/course-category.entity';
import { CASLModule } from '@/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseCategory]), CASLModule],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
  exports: [CourseCategoryModule],
})
export class CourseCategoryModule {}
