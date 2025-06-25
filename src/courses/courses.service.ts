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
import {
  AdminCourseSearchResponseDto,
  CourseResponseDto,
  CourseSearchResponseDto,
  InstructorCourseSearchResponseDto,
  SearchCourseDto,
  StudentCourseSearchResponseDto,
} from './dto/search-course.dto';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { PredefinedRoles } from '@/enums/role.enum';
import { Instructor } from '../instructors/entities/instructor.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
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
      throw new ForbiddenException(errors.notFound('Permission denied'));
    }

    const slug = slugify(name);
    let thumbnailPath = null;
    /* console.log('File:', file);
    console.log('File.path:', file.path);
    console.log('File.filename:', file.filename);
    console.log('File.originalname:', file.originalname);
    console.log('File.mimetype:', file.mimetype);
    console.log('File.size:', file.size);
    console.log('File.destination:', file.destination);
    console.log('File.buffer:', file.buffer);
    console.log('File.encoding:', file.encoding);
    console.log('File.fieldname:', file.fieldname);
    console.log('File.stream:', file.stream); */

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

  async searchCoursesByRole(
    searchCourseDto: SearchCourseDto,
    user: CurrentUserInfo
  ): Promise<CourseSearchResponseDto> {
    const {
      name: searchTerm = '',
      cohortId,
      page = 1,
      limit = 10,
    } = searchCourseDto;
    // Get user with role
    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(CourseActions.SEARCH_COURSES, CourseSubject.NAME)) {
      throw new ForbiddenException(errors.forbiddenAccess('Permission denied'));
    }

    const cohort =
      (await this.cohortService.findOne(cohortId)) ??
      (await this.cohortService.findActive());
    if (!cohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }

    const userRoles = dbUser.roles.map((role) => role.name);
    if (userRoles.includes(PredefinedRoles.ADMIN)) {
      return this.getAdminCourseSearch(searchTerm);
    }
    if (userRoles.includes(PredefinedRoles.SUPER_ADMIN)) {
      return this.getAdminCourseSearch(searchTerm);
    }

    if (userRoles.includes(PredefinedRoles.INSTRUCTOR)) {
      const instructor = await this.instructorRepository.findOneBy({
        user: { id: dbUser.id },
      });

      if (!instructor) {
        throw new NotFoundException(errors.notFound('Instructor not found'));
      }
      return this.getInstructorCourseSearch(
        instructor.id,
        searchTerm,
        cohort.id
      );
    }

    if (userRoles.includes(PredefinedRoles.STUDENT)) {
      const student = await this.studentRepository.findOneBy({
        user: { id: dbUser.id },
      });

      if (!student) {
        throw new NotFoundException(errors.notFound('Student not found'));
      }
      return this.getStudentCourseSearch(student.id, searchTerm, cohort.id);
    }
  }

  private async getStudentCourseSearch(
    studentId: string,
    searchTerm?: string,
    cohortId?: string
  ): Promise<StudentCourseSearchResponseDto> {
    // Get enrolled courses for the student
    const enrolledCoursesQuery = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.cohortCourse', 'cohortCourse')
      .leftJoinAndSelect('cohortCourse.course', 'course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('instructor.user', 'user')
      .where('enrollment.studentId = :studentId', { studentId })
      .andWhere('course.deletedAt IS NULL');

    if (cohortId) {
      enrolledCoursesQuery
        .andWhere('enrollment.cohortId = :cohortId', {
          cohortId,
        })
        .andWhere('cohortCourse.cohortId = :cohortId', {
          cohortId,
        });
    }

    if (searchTerm && searchTerm !== '') {
      enrolledCoursesQuery
        .andWhere('course.name ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('course.slug ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
    }

    const enrolledCoursesData = await enrolledCoursesQuery.getMany();

    const enrolledCourses = enrolledCoursesData
      .map((enrollment) => enrollment.cohortCourse.course)
      .filter(Boolean)
      .map((course) => this.mapCourseToDto(course));

    // Get enrolled course IDs to exclude from available courses
    const enrolledCourseIds = enrolledCourses.map((course) => course.id);

    // Get available courses (published courses not enrolled in)
    const availableCoursesQuery = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.cohortCourses', 'cohortCourse')
      .leftJoinAndSelect('cohortCourse.cohort', 'cohort')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('instructor.user', 'user')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .andWhere('course.deletedAt IS NULL');

    if (enrolledCourseIds.length > 0) {
      availableCoursesQuery.andWhere(
        'course.id NOT IN (:...enrolledCourseIds)',
        {
          enrolledCourseIds,
        }
      );
    }

    if (cohortId) {
      availableCoursesQuery.andWhere('cohortCourse.cohortId = :cohortId', {
        cohortId,
      });
    }

    if (searchTerm && searchTerm !== '') {
      availableCoursesQuery
        .andWhere('course.name ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('course.slug ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
    }

    const availableCoursesData = await availableCoursesQuery.getMany();
    const availableCourses = availableCoursesData.map((course) =>
      this.mapCourseToDto(course)
    );

    return {
      enrolledCourses,
      availableCourses,
    };
  }

  private async getInstructorCourseSearch(
    instructorId: string,
    searchTerm?: string,
    cohortId?: string
  ): Promise<InstructorCourseSearchResponseDto> {
    // Get courses assigned to the instructor
    const assignedCoursesQuery = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.cohortCourses', 'cohortCourse')
      .leftJoinAndSelect('cohortCourse.cohort', 'cohort')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('instructor.user', 'user')
      .where('course.instructorId = :instructorId', { instructorId })
      .andWhere('course.deletedAt IS NULL');

    if (cohortId) {
      assignedCoursesQuery.andWhere('cohortCourse.cohortId = :cohortId', {
        cohortId,
      });
    }
    if (searchTerm && searchTerm !== '') {
      assignedCoursesQuery
        .andWhere('course.name ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('course.slug ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
    }

    const assignedCoursesData = await assignedCoursesQuery.getMany();

    const assignedCourses = assignedCoursesData.map((course) =>
      this.mapCourseToDto(course)
    );

    return {
      assignedCourses,
    };
  }

  private async getAdminCourseSearch(
    searchTerm?: string
  ): Promise<AdminCourseSearchResponseDto> {
    // Get draft courses
    const draftCoursesQuery = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.cohortCourses', 'cohortCourse')
      .leftJoinAndSelect('cohortCourse.cohort', 'cohort')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('instructor.user', 'user')
      .where('course.status = :status', { status: CourseStatus.DRAFT })
      .andWhere('course.deletedAt IS NULL');

    if (searchTerm && searchTerm !== '') {
      draftCoursesQuery
        .andWhere('course.name ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('course.slug ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
    }

    const draftCoursesData = await draftCoursesQuery.getMany();
    const draftCourses = draftCoursesData.map((course) =>
      this.mapCourseToDto(course)
    );

    // Get published courses
    const publishedCoursesQuery = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.cohortCourses', 'cohortCourse')
      .leftJoinAndSelect('cohortCourse.cohort', 'cohort')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('instructor.user', 'user')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .andWhere('course.deletedAt IS NULL');

    if (searchTerm && searchTerm !== '') {
      publishedCoursesQuery.andWhere('course.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    const publishedCoursesData = await publishedCoursesQuery.getMany();
    const publishedCourses = publishedCoursesData.map((course) =>
      this.mapCourseToDto(course)
    );

    return {
      draftCourses,
      publishedCourses,
    };
  }

  private mapCourseToDto(course: Course): CourseResponseDto {
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      status: course.status,
      estimatedDurationForCompletion: course.estimatedDurationForCompletion,
      instructor: course.instructor
        ? {
            id: course.instructor.id,
            name: course.instructor.user.name,
            email: course.instructor.user.email,
          }
        : undefined,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
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
      relations: {
        instructor: {
          user: true,
        },
      },
      order: {
        name: 'ASC',
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

  async findOneByUser(
    id: string,
    user: CurrentUserInfo
  ): Promise<Course | null> {
    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(CourseActions.SEARCH_COURSES, CourseSubject.NAME)) {
      throw new ForbiddenException(errors.forbiddenAccess('Permission denied'));
    }

    const userRoles = dbUser.roles.map((role) => role.name);
    if (userRoles.includes(PredefinedRoles.ADMIN)) {
      return this.courseRepository.findOne({
        where: { id },
        relations: {
          instructor: {
            user: true,
          },
          schedules: true,
          lessons: true,
        },
      });
    }
    if (userRoles.includes(PredefinedRoles.SUPER_ADMIN)) {
      return this.courseRepository.findOne({
        where: { id },
        relations: {
          instructor: {
            user: true,
          },
          schedules: true,
          lessons: true,
          cohortCourses: {
            cohort: { enrollments: { student: { user: true } } },
          },
        },
      });
    }

    if (userRoles.includes(PredefinedRoles.INSTRUCTOR)) {
      return this.courseRepository.findOne({
        where: { id },
        relations: {
          instructor: {
            user: true,
          },
          lessons: true,
          cohortCourses: {
            cohort: { enrollments: { student: { user: true } } },
          },
        },
      });
    }
    if (userRoles.includes(PredefinedRoles.STUDENT)) {
      return this.courseRepository.findOne({
        where: { id },
        relations: {
          instructor: {
            user: true,
          },
          lessons: true,
        },
      });
    }
    return null;
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

    let instructor = await this.instructorService.findOne(instructorId);

    if (!instructor) {
      instructor = await this.instructorRepository.findOneBy({
        user: {
          id: user.id,
        },
      });
      if (!user) {
        throw new NotFoundException(errors.notFound('Instructor not found'));
      }
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

    if (course.cohortCourses?.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Course cannot be deleted because it has cohorts')
      );
    }
    if (course.schedules?.length > 0) {
      throw new InternalServerErrorException(
        errors.serverError('Course cannot be deleted because it has schedules')
      );
    }
    if (course.lessons?.length > 0) {
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
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { schedules: true },
    });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    if (course.schedules?.length <= 0) {
      throw new BadRequestException(
        errors.validationFailed(
          "Course cannot be published because it doesn't have schedules"
        )
      );
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

    const student = await this.studentRepository.findOneBy({
      user: { id: user.id },
    });
    if (!student) {
      throw new NotFoundException(errors.notFound('Student not found'));
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
    const isAlreadyEnrolled =
      await this.enrollmentsService.isUserEnrolledInCourse(
        dbUser.id,
        cohort.id,
        course.id
      );
    if (isAlreadyEnrolled) {
      throw new ConflictException(
        errors.conflictError('User already enrolled in course')
      );
    }

    // Create enrollment for the user
    const enrollment = await this.enrollmentsService.create({
      studentId: student.id,
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
