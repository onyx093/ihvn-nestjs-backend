import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Cohort } from './entities/cohort.entity';
import { slugify } from '@/lib/helpers';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import errors from '@/config/errors.config';
import { Course } from '../courses/entities/course.entity';
import { CohortCourse } from '@/cohort-courses/entities/cohort-course.entity';

@Injectable()
export class CohortsService {
  constructor(
    @InjectRepository(Cohort) private cohortRepository: Repository<Cohort>,
    @InjectRepository(Course) private courseRepository: Repository<Course>
  ) {}

  async create(createCohortDto: CreateCohortDto): Promise<Cohort> {
    const { name, startDate, endDate, courseIds } = createCohortDto;
    const slug = slugify(name);
    const cohort = this.cohortRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const cohort = this.cohortRepository.create({
          name,
          startDate,
          endDate,
          slug,
        });
        await transactionalEntityManager.save(cohort);

        if (createCohortDto.courseIds?.length) {
          const courses = await this.courseRepository.findBy({
            id: In(courseIds),
          });

          if (courses.length !== courseIds.length) {
            throw new NotFoundException(
              errors.notFound('One or more courses not found')
            );
          }

          const cohortCourses = courses.map((course) => {
            const cohortCourse = new CohortCourse({});
            cohortCourse.course = course;
            cohortCourse.cohort = cohort;
            return cohortCourse;
          });
          await transactionalEntityManager.save(cohortCourses);
          await transactionalEntityManager.save(cohort);
        }

        return cohort;
      }
    );
    return cohort;
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Cohort>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.cohortRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['lessons', 'cohortCourses.course'],
      where: {
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Cohort | null> {
    return this.cohortRepository.findOne({
      where: { id },
      relations: ['enrollments', 'lessons', 'cohortCourses.course'],
    });
  }

  async update(id: string, updateCohortDto: UpdateCohortDto): Promise<Cohort> {
    const cohort = await this.cohortRepository.findOne({ where: { id } });
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const updatedCohort = {
      ...cohort,
      ...updateCohortDto,
      slug: updateCohortDto.name ? slugify(updateCohortDto.name) : cohort.slug,
      updatedAt: new Date(),
    };
    return this.cohortRepository.save(updatedCohort);
  }

  async remove(id: string): Promise<void> {
    const cohort = await this.cohortRepository.findOneBy({ id });
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }
    if (cohort.isActive) {
      throw new InternalServerErrorException(
        errors.serverError('Cannot delete an active cohort')
      );
    }
    if (cohort.enrollments.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Cannot delete a cohort with enrollments')
      );
    }
    if (cohort.lessons.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Cannot delete a cohort with lessons')
      );
    }
    await this.cohortRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const cohort = await this.cohortRepository.findOneBy({ id });
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }
    await this.cohortRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const cohort = await this.cohortRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }
    await this.cohortRepository.restore(id);
  }

  async activateCohort(id: string): Promise<Cohort> {
    return this.cohortRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Cohort,
          { isActive: true },
          { isActive: false }
        );

        const cohort = await transactionalEntityManager.findOne(Cohort, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!cohort) throw new NotFoundException('Cohort not found');

        cohort.isActive = true;
        await transactionalEntityManager.save(cohort);
        return cohort;
      }
    );
  }

  async findActive(): Promise<Cohort | null> {
    return this.cohortRepository.findOne({
      where: {
        isActive: true,
        deletedAt: null, // Optional: Include if you want to exclude soft-deleted rows
      },
      order: { createdAt: 'DESC' },
    });
  }
}
