import fs from 'fs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { slugify } from '@/lib/helpers';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { CourseStatus } from '../enums/course-status.enum';
import { InstructorsService } from '@/instructors/instructors.service';
import { CurrentUserInfo } from '@/common/interfaces/current-user-info.interface';
import { UsersService } from '@/users/users.service';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory';
import { CourseActions, CourseSubject } from './actions/courses.actions';
import { CohortsService } from '@/cohorts/cohorts.service';
import { CohortCoursesService } from '@/cohort-courses/cohort-courses.service';
import { EnrollmentsService } from '@/enrollments/enrollments.service';
import { SearchCourseDto } from './dto/search-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly instructorService: InstructorsService,
    private readonly userService: UsersService,
    private readonly cohortService: CohortsService,
    private readonly cohortCoursesService: CohortCoursesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
    user: CurrentUserInfo
  ): Promise<Course> {
    /* if (!file) {
      throw new BadRequestException(
        errors.validationFailed('A thumbnail is required')
      );
    } */

    const { name, description, instructorId, estimatedDurationForCompletion } =
      createCourseDto;

    const instructor = await this.instructorService.findOne(instructorId);

    if (!instructor) {
      throw new NotFoundException(errors.notFound('Instructor not found'));
    }

    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(CourseActions.CREATE_COURSES, CourseSubject.NAME)) {
      throw new NotFoundException(errors.notFound('Permission denied'));
    }

    const slug = slugify(name);
    let thumbnailPath = null;
    if (file) {
      thumbnailPath = `/thumbnails/${file.filename}`;
    }
    const course = this.courseRepository.create({
      name,
      description,
      estimatedDurationForCompletion,
      slug,
      thumbnail: thumbnailPath,
    });
    course.instructor = instructor;
    course.createdBy = dbUser;
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

  async searchCourses(
    searchCourseDto: SearchCourseDto
  ): Promise<PaginationResult<Course>> {
    const { name, page = 1, limit = 10 } = searchCourseDto;

    const whereCondition = name ? { name: ILike(`%${name}%`) } : {};

    const [data, total] = await this.courseRepository.findAndCount({
      where: whereCondition,
      order: { name: 'ASC' },
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

  async findAll(
    paginationDto: PaginationDto,
    user: CurrentUserInfo
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

  async findAllWithDrafts(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Course>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.courseRepository.findAndCount({
      where: {
        status: Not(IsNull()),
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
    file: Express.Multer.File,
    user: CurrentUserInfo
  ): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const { name, description, instructorId, estimatedDurationForCompletion } =
      updateCourseDto;

    const instructor = await this.instructorService.findOne(instructorId);

    if (!instructor) {
      throw new NotFoundException(errors.notFound('Instructor not found'));
    }

    /* if (!course.thumbnail && !thumbnail?.filename) {
      throw new BadRequestException(
        errors.validationFailed('A valid thumbnail is required')
      );
    } */

    let thumbnailPath = null;
    if (file) {
      thumbnailPath = `/thumbnails/${file.filename}`;
    }
    const updatedCourse = {
      ...course,
      name: updateCourseDto.name ?? course.name,
      description: updateCourseDto.description ?? course.description,
      estimatedDurationForCompletion:
        updateCourseDto.estimatedDurationForCompletion ??
        course.estimatedDurationForCompletion,
      instructor: instructor ?? course.instructor,
      slug: updateCourseDto.name ? slugify(name) : course.slug,
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
    const course = await this.courseRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    await this.courseRepository.restore(id);
  }

  async publish(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    course.status = CourseStatus.PUBLISHED;
    return this.courseRepository.save(course);
  }

  async unpublish(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    course.status = CourseStatus.DRAFT;
    return this.courseRepository.save(course);
  }

  async enroll(id: string, user: CurrentUserInfo): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(CourseActions.ENROLL_COURSES, CourseSubject.NAME)) {
      throw new ForbiddenException(errors.forbiddenAccess('Permission denied'));
    }

    const cohort = await this.cohortService.findActive();
    if (!cohort) {
      throw new BadRequestException(
        errors.validationFailed('No cohort is active a the moment')
      );
    }

    const cohortCourse = await this.cohortCoursesService.findByCohortAndCourse(
      cohort.id,
      course.id
    );
    if (!cohortCourse) {
      throw new NotFoundException(errors.notFound('Cohort course not found'));
    }

    // Check if user is already enrolled in the course
    const isAlreadyEnrolled = this.enrollmentsService.isUserEnrolledInCourse(
      dbUser.id,
      cohort.id,
      course.id
    );
    if (isAlreadyEnrolled) {
      throw new ConflictException(
        errors.notFound('User already enrolled in course')
      );
    }

    // Create enrollment for the user
    const enrollment = await this.enrollmentsService.create({
      studentId: dbUser.id,
      cohortId: cohort.id,
      courseId: course.id,
    });
    if (!enrollment) {
      throw new InternalServerErrorException(
        errors.serverError('Failed to enroll user in course')
      );
    }
  }

  async unenroll(id: string, user: CurrentUserInfo): Promise<void> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(CourseActions.UNENROLL_COURSES, CourseSubject.NAME)) {
      throw new ForbiddenException(errors.forbiddenAccess('Permission denied'));
    }

    const cohort = await this.cohortService.findActive();
    if (!cohort) {
      throw new BadRequestException(
        errors.validationFailed('No cohort is active a the moment')
      );
    }

    const cohortCourse = await this.cohortCoursesService.findByCohortAndCourse(
      cohort.id,
      course.id
    );
    if (!cohortCourse) {
      throw new NotFoundException(errors.notFound('Cohort course not found'));
    }

    const isAlreadyEnrolled = this.enrollmentsService.isUserEnrolledInCourse(
      dbUser.id,
      cohort.id,
      course.id
    );
    if (isAlreadyEnrolled) {
      await this.enrollmentsService.softDelete(id);
    } else {
      throw new NotFoundException(
        errors.notFound('User not enrolled in course')
      );
    }
  }
}
