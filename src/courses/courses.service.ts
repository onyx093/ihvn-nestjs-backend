import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { slugify } from '@/lib/helpers';
import errors from '@/config/errors.config';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const slug = slugify(createCourseDto.title);
    const course = this.courseRepository.create({ ...createCourseDto, slug });
    return this.courseRepository.save(course);
  }

  findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    const updatedCourse = {
      ...course,
      ...updateCourseDto,
      slug: updateCourseDto.title
        ? slugify(updateCourseDto.title)
        : course.slug,
      updatedAt: new Date(),
    };
    return this.courseRepository.save(updatedCourse);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
