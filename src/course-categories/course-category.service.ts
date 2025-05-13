import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCategory } from './entities/course-category.entity';
import { Repository } from 'typeorm';
import errors from '@/config/errors.config';
import { slugify } from '@/lib/helpers';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { PaginationDto } from '@/common/dto/pagination.dto';

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

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<CourseCategory>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.courseCategoryRepository.findAndCount({
      relations: { courses: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
    const courseCategory = await this.courseCategoryRepository.findOneBy({
      id,
    });
    if (!courseCategory) {
      throw new NotFoundException(errors.notFound('Category not found'));
    }
    await this.courseCategoryRepository.delete(id);
  }
}
