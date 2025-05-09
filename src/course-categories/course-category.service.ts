import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCategory } from './entities/course-category.entity';
import { Repository } from 'typeorm';
import errors from '@/config/errors.config';
import { slugify } from '@/lib/helpers';

@Injectable()
export class CourseCategoryService {
  constructor(
    @InjectRepository(CourseCategory)
    private readonly courseCategoryRepository: Repository<CourseCategory>
  ) {}
  async create(
    createCourseCategoryDto: CreateCourseCategoryDto
  ): Promise<CourseCategory> {
    const slug = slugify(createCourseCategoryDto.name);
    const courseCategory = this.courseCategoryRepository.create({
      ...createCourseCategoryDto,
      slug,
    });
    return this.courseCategoryRepository.save(courseCategory);
  }

  findAll(): Promise<CourseCategory[]> {
    return this.courseCategoryRepository.find({ relations: { courses: true } });
  }

  async findOne(id: string): Promise<CourseCategory | null> {
    return this.courseCategoryRepository.findOne({
      where: { id },
      relations: { courses: true },
    });
  }

  async update(
    id: string,
    updateCourseCategoryDto: UpdateCourseCategoryDto
  ): Promise<CourseCategory> {
    const courseCategory = await this.courseCategoryRepository.findOneBy({
      id,
    });
    if (!courseCategory) {
      throw new NotFoundException(errors.notFound('Category not found'));
    }
    const updatedCourseCategory = {
      ...courseCategory,
      ...updateCourseCategoryDto,
      slug: slugify(updateCourseCategoryDto.name),
      updatedAt: new Date(),
    };
    return this.courseCategoryRepository.save(updatedCourseCategory);
  }

  async remove(id: string): Promise<void> {
    await this.courseCategoryRepository.delete(id);
  }
}
