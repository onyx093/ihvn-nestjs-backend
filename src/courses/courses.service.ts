import fs from 'fs';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { slugify } from '@/lib/helpers';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { CourseStatus } from '../enums/course-status.enum';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File
  ): Promise<Course> {
    /* if (!file) {
      throw new BadRequestException(
        errors.validationFailed('A thumbnail is required')
      );
    } */

    console.log('Uploaded File:', {
      originalname: file?.originalname,
      filename: file?.filename,
      path: file?.path,
      size: file?.size,
    });

    const slug = slugify(createCourseDto.name);
    let thumbnailPath = null;
    if (file) {
      thumbnailPath = `/thumbnails/${file.filename}`;
    }
    const course = this.courseRepository.create({
      ...createCourseDto,
      slug,
      thumbnail: thumbnailPath,
    });
    try {
      return this.courseRepository.save(course);
    } catch (error) {
      // Cleanup uploaded file if save fails
      fs.unlinkSync(file.path);
      throw new InternalServerErrorException(
        errors.serverError('Failed to create course')
      );
    }
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Course>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.courseRepository.findAndCount({
      where: {
        status: CourseStatus.PUBLISHED,
      },
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

  async findOne(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file: Express.Multer.File
  ): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    /* if (!course.thumbnail && !thumbnail?.filename) {
      throw new BadRequestException(
        errors.validationFailed('A valid thumbnail is required')
      );
    } */

    if (file) {
      console.log('Uploaded File:', {
        originalname: file?.originalname,
        filename: file?.filename,
        path: file?.path,
        size: file?.size,
      });
    }
    let thumbnailPath = null;
    if (file) {
      thumbnailPath = `/thumbnails/${file.filename}`;
    }
    const updatedCourse = {
      ...course,
      ...updateCourseDto,
      slug: updateCourseDto.name ? slugify(updateCourseDto.name) : course.slug,
      thumbnail: thumbnailPath ?? null,
      updatedAt: new Date(),
    };
    try {
      return this.courseRepository.save(updatedCourse);
    } catch (error) {
      // Cleanup uploaded file if save fails
      fs.unlinkSync(file.path);
      throw new InternalServerErrorException(
        errors.serverError('Failed to update course')
      );
    }
  }

  async remove(id: string): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    if (course.schedules.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Course cannot be deleted because it has schedules')
      );
    }
    if (course.lessons.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Course cannot be deleted because it has lessons')
      );
    }
    if (course.thumbnail) {
      const thumbnailPath = `./uploads${course.thumbnail}`;
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await this.courseRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    await this.courseRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    await this.courseRepository.restore(id);
  }
}
