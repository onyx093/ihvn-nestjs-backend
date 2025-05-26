import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActiveCourseDto } from './dto/create-active-course.dto';
import { UpdateActiveCourseDto } from './dto/update-active-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveCourse } from './entities/active-course.entity';
import errors from '@/config/errors.config';
import { CohortsService } from '@/cohorts/cohorts.service';
import { CoursesService } from '@/courses/courses.service';

@Injectable()
export class ActiveCoursesService {
  constructor(
    @InjectRepository(ActiveCourse)
    private activeCourseRepository: Repository<ActiveCourse>,
    private readonly cohortService: CohortsService,
    private readonly courseService: CoursesService
  ) {}
  async create(
    createActiveCourseDto: CreateActiveCourseDto,
    cohortId: string
  ): Promise<ActiveCourse> {
    const cohort = await this.cohortService.findOne(cohortId);
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }

    const course = await this.courseService.findOne(
      createActiveCourseDto.courseId
    );
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const activeCourse = this.activeCourseRepository.create({
      course,
      cohort,
    });
    return await this.activeCourseRepository.save(activeCourse);
  }

  async findAll(cohortId: string): Promise<ActiveCourse[]> {
    return await this.activeCourseRepository.find({
      where: { cohort: { id: cohortId } },
      relations: ['course'],
    });
    /* const cohort = await this.cohortService.findOne(cohortId);
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }
    return cohort.activeCourses; */
  }

  findOne(id: number) {
    return `This action returns a #${id} activeCourse`;
  }

  update(id: number, updateActiveCourseDto: UpdateActiveCourseDto) {
    return `This action updates a #${id} activeCourse`;
  }

  async remove(id: string): Promise<void> {
    const activeCourse = await this.activeCourseRepository.findOneBy({ id });
    if (!activeCourse) {
      throw new NotFoundException(
        errors.notFound('Course has not been made active for this cohort')
      );
    }
    await this.activeCourseRepository.delete(id);
  }
}
