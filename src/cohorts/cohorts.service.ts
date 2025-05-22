import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from './entities/cohort.entity';
import { slugify } from '@/lib/helpers';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import errors from '@/config/errors.config';
import { LessonService } from '@/lesson/lesson.service';

@Injectable()
export class CohortsService {
  constructor(
    @InjectRepository(Cohort) private cohortRepository: Repository<Cohort>,
    private lessonService: LessonService
  ) {}

  async create(createCohortDto: CreateCohortDto): Promise<Cohort> {
    const slug = slugify(createCohortDto.name);
    const cohort = this.cohortRepository.create({
      ...createCohortDto,
      slug,
    });
    return this.cohortRepository.save(cohort);
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Cohort>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.cohortRepository.findAndCount({
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

  async findOne(id: string): Promise<Cohort | null> {
    return this.cohortRepository.findOne({
      where: { id },
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
    const cohort = await this.cohortRepository.findOneBy({ id });
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
        /* await this.lessonService.generateLessonsForCohort(
          cohort,
          transactionalEntityManager
        ); */
        return cohort;
      }
    );
  }

  async findActive(): Promise<Cohort | null> {
    return this.cohortRepository.findOne({
      where: { isActive: true },
    });
  }
}
