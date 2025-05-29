import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCohortCourseDto } from './dto/create-cohort-course.dto';
import { UpdateCohortCourseDto } from './dto/update-cohort-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CohortCourse } from './entities/cohort-course.entity';
import errors from '@/config/errors.config';
import { CohortsService } from '@/cohorts/cohorts.service';
import { CoursesService } from '@/courses/courses.service';

@Injectable()
export class CohortCoursesService {
  constructor(
    @InjectRepository(CohortCourse)
    private cohortCourseRepository: Repository<CohortCourse>,
    private readonly cohortService: CohortsService,
    private readonly courseService: CoursesService
  ) {}
  async create(
    createCohortCourseDto: CreateCohortCourseDto,
    cohortId: string
  ): Promise<CohortCourse> {
    const cohort = await this.cohortService.findOne(cohortId);
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }

    const course = await this.courseService.findOne(
      createCohortCourseDto.courseId
    );
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const cohortCourse = this.cohortCourseRepository.create({
      course,
      cohort,
    });
    return await this.cohortCourseRepository.save(cohortCourse);
  }

  async findAll(cohortId: string): Promise<CohortCourse[]> {
    return await this.cohortCourseRepository.find({
      where: { cohort: { id: cohortId } },
      relations: ['course'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cohortCourse`;
  }

  update(id: number, updateCohortCourseDto: UpdateCohortCourseDto) {
    return `This action updates a #${id} cohortCourse`;
  }

  async remove(id: string): Promise<void> {
    const cohortCourse = await this.cohortCourseRepository.findOneBy({ id });
    if (!cohortCourse) {
      throw new NotFoundException(
        errors.notFound('Course has not been made active for this cohort')
      );
    }
    await this.cohortCourseRepository.delete(id);
  }
}
