import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { CohortsService } from '@/cohorts/cohorts.service';
import { StudentsService } from '@/students/students.service';
import { CoursesService } from '@/courses/courses.service';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly cohortService: CohortsService,
    private readonly studentService: StudentsService,
    @Inject(forwardRef(() => CoursesService))
    private readonly courseService: CoursesService
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const activeCohort = createEnrollmentDto.cohortId
      ? await this.cohortService.findOne(createEnrollmentDto.cohortId)
      : await this.cohortService.findActive();
    if (!activeCohort) {
      throw new BadRequestException(
        errors.validationFailed('No active cohort available')
      );
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: createEnrollmentDto.studentId },
        cohort: { id: activeCohort.id },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException(
        errors.conflictError('Student already enrolled in active cohort')
      );
    }

    const [student, course] = await Promise.all([
      this.studentService.findOne(createEnrollmentDto.studentId),
      this.courseService.findOne(createEnrollmentDto.courseId),
    ]);

    const enrollment = this.enrollmentRepository.create({
      student,
      cohort: activeCohort,
      course,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async findAll(
    cohortId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Enrollment>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.enrollmentRepository.findAndCount({
      where: {
        cohort: { id: cohortId },
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

  async findOne(id: string): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });

    if (!enrollment) {
      throw new NotFoundException(errors.notFound('Enrollment not found'));
    }

    const activeCohort = updateEnrollmentDto.cohortId
      ? await this.cohortService.findOne(updateEnrollmentDto.cohortId)
      : await this.cohortService.findActive();
    if (!activeCohort) {
      throw new BadRequestException(
        errors.validationFailed('No active cohort available')
      );
    }

    const [student, course] = await Promise.all([
      this.studentService.findOne(updateEnrollmentDto.studentId),
      this.courseService.findOne(updateEnrollmentDto.courseId),
    ]);

    const updatedEnrollment = {
      ...enrollment,
      student: student ? student : enrollment.student,
      cohort: activeCohort,
      course: course ? course : enrollment.course,
    };

    return this.enrollmentRepository.save(updatedEnrollment);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) {
      throw new NotFoundException(errors.notFound('Enrollment not found'));
    }
    await this.enrollmentRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) {
      throw new NotFoundException(errors.notFound('Enrollment not found'));
    }
    await this.enrollmentRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) {
      throw new NotFoundException(errors.notFound('Enrollment not found'));
    }
    await this.enrollmentRepository.restore(id);
  }

  async isUserEnrolledInCourse(
    studentId: string,
    cohortId: string,
    courseId: string
  ): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: studentId },
        cohort: { id: cohortId },
        course: { id: courseId },
      },
    });

    if (!enrollment) {
      return false;
    }

    const activeCohort = await this.cohortService.findActive();
    return enrollment.cohort.id === activeCohort.id;
  }
}
