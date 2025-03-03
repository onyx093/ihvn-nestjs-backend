import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CASLModule } from '@/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), CASLModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
