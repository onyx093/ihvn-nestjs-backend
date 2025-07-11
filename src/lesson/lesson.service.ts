import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { In, Repository } from 'typeorm';
import { WeekDay, WeekDaysList } from '@/enums/week-day.enum';
import errors from '@/config/errors.config';
import { CohortStatus } from '@/enums/cohort-status.enum';
import { CurrentUserInfo } from '@/common/interfaces/current-user-info.interface';
import { LessonActions, LessonSubject } from './actions/lesson.actions';
import { UsersService } from '@/users/users.service';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory';
import { PredefinedRoles } from '@/enums/role.enum';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Student } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { randomize } from '@/lib/util';
import { colorCodes } from '@/lib/constants';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Cohort)
    private cohortRepository: Repository<Cohort>,
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private readonly userService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  async generateLessonsForActiveCohort(cohortId: string) {
    const activeCohort = await this.cohortRepository.findOne({
      where: { id: cohortId, isActive: true },
      relations: [
        'cohortCourses',
        'cohortCourses.course',
        'cohortCourses.course.schedules',
      ],
    });

    if (!activeCohort) {
      throw new NotFoundException(
        errors.notFound(
          'Cohort not found or is not active for generating lessons right now'
        )
      );
    }

    if (activeCohort.status === CohortStatus.COMPLETED) {
      throw new BadRequestException(
        errors.validationFailed('Cohort is already completed')
      );
    }

    if (
      !activeCohort.cohortCourses ||
      activeCohort.cohortCourses.length === 0
    ) {
      throw new NotFoundException(
        errors.notFound('No courses found for the active cohort')
      );
    }

    if (
      activeCohort.cohortCourses.some(
        (cc) => !cc.course.schedules || cc.course.schedules.length === 0
      )
    ) {
      throw new BadRequestException(
        errors.validationFailed('One or more courses have no schedules')
      );
    }

    const preparedLessons: Lesson[] = [];

    for (const course of activeCohort.cohortCourses.map((cc) => cc.course)) {
      const schedules = course.schedules;

      const start = new Date(activeCohort.startDate);
      const end = new Date(activeCohort.endDate);

      let lessonNumber = 1;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayName = d.toLocaleDateString('en-US', {
          weekday: 'long',
        });

        const schedule = schedules.find(
          (s) => WeekDaysList[s.dayOfWeek] === dayName
        );
        if (schedule) {
          const dateStr = d.toISOString().split('T')[0];

          const exists = await this.lessonRepository.findOne({
            where: {
              course: { id: course.id },
              cohort: { id: activeCohort.id },
              date: new Date(dateStr),
            },
          });

          if (!exists) {
            const lesson = this.lessonRepository.create({
              name: `Lesson ${lessonNumber++}`,
              course,
              cohort: activeCohort,
              colorCode: randomize(colorCodes),
              date: new Date(dateStr),
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            });
            preparedLessons.push(lesson);
          }
        }
      }
    }

    const savedLessons = await this.lessonRepository.save(preparedLessons);
    if (savedLessons) {
      return {
        message: 'Lessons generated successfully',
      };
    }
  }

  /* async generateLessonsForCourseInCohort(courseId: string, cohortId: string) {
    const cohort = await this.cohortRepository.findOneOrFail({
      where: { id: cohortId },
      relations: ['courses'],
    });

    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
      relations: ['schedules'],
    });

    if (
      !cohort.cohortCourses
        .map((cc) => cc.course)
        .some((c) => c.id === course.id)
    ) {
      throw new BadRequestException(
        errors.validationFailed('Course not in cohort')
      );
    }

    const cohortCourse = cohort.cohortCourses.find(
      (cc) => cc.course.id === course.id
    );

    if (!cohortCourse) {
      throw new NotFoundException(
        errors.notFound('Cohort/Course combination not found')
      );
    }

    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', {
        weekday: 'long',
      }) as unknown as WeekDay;
      const schedule = course.schedules.find((s) => s.dayOfWeek === dayName);
      if (schedule) {
        const dateStr = d.toISOString().split('T')[0];
        const exists = await this.lessonRepository.findOne({
          where: {
            course: { id: courseId },
            cohort: { id: cohortId },
            date: new Date(dateStr),
          },
        });

        if (!exists) {
          const lesson = this.lessonRepository.create({
            course,
            cohort,
            date: dateStr,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          });

          await this.lessonRepository.save(lesson);
        }
      }
    }
  } */

  async generateLessonsForCourseInCohort(courseId: string, cohortId: string) {
    const cohort = await this.cohortRepository.findOneOrFail({
      where: { id: cohortId },
      relations: ['courses', 'cohortCourses'],
    });

    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
      relations: ['schedules'],
    });

    // Validate course is in cohort
    const cohortCourse = cohort.cohortCourses.find(
      (cc) => cc.course.id === course.id
    );

    if (!cohortCourse) {
      throw new BadRequestException(
        errors.validationFailed('Course not in cohort')
      );
    }

    const start = new Date(cohort.startDate);
    const cohortEnd = new Date(cohort.endDate);

    const calculatedEnd = new Date(start);
    calculatedEnd.setDate(
      calculatedEnd.getDate() + course.estimatedDurationForCompletion * 7
    );

    const end = new Date(
      Math.min(calculatedEnd.getTime(), cohortEnd.getTime())
    );

    const lessonsToCreate = [];

    // Pre-fetch all existing lessons to avoid per-day DB hit
    const existingLessons = await this.lessonRepository.find({
      where: {
        course: { id: courseId },
        cohort: { id: cohortId },
      },
    });

    const existingDates = new Set(
      existingLessons.map((l) => l.date.toISOString().split('T')[0])
    );

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', {
        weekday: 'long',
      }) as unknown as WeekDay;

      const schedule = course.schedules.find((s) => s.dayOfWeek === dayName);
      if (!schedule) continue;

      const dateStr = d.toISOString().split('T')[0];

      if (!existingDates.has(dateStr)) {
        lessonsToCreate.push(
          this.lessonRepository.create({
            course,
            cohort,
            date: new Date(dateStr),
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })
        );
      }
    }

    if (lessonsToCreate.length > 0) {
      await this.lessonRepository.save(lessonsToCreate);
    }
  }

  /* async generateLessons(cohortId: string): Promise<Lesson[]> {
    const cohort = await this.cohortRepository.findOne({
      where: { id: cohortId },
      relations: ['course', 'course.schedules'],
    });
    
    if (!cohort) throw new NotFoundException('Cohort not found');
    if (!cohort.isActive) throw new Error('Cohort is not active');

    // Delete existing lessons for regeneration
    await this.lessonRepository.delete({ cohort: { id: cohortId } });

    const lessons: Lesson[] = [];
    const startDate = parseISO(cohort.startDate);
    const endDate = parseISO(cohort.endDate);

    for (const schedule of cohort.course.schedules) {
      const dayNumber = this.getDayNumber(schedule.day);
      let lessonDate = nextDay(startDate, dayNumber);

      while (isBefore(lessonDate, endDate) {
        lessons.push(this.lessonRepository.create({
          cohort,
          schedule,
          date: formatISO(lessonDate, { representation: 'date' }),
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        }));
        
        lessonDate = addDays(lessonDate, 7); // Add 1 week
      }
    }

    return this.lessonRepository.save(lessons);
  } */

  async getCohortLessons(
    cohortId: string,
    user: CurrentUserInfo
  ): Promise<Lesson[]> {
    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(errors.notFound('User not found'));
    }

    const ability = this.caslAbilityFactory.createForUser(dbUser);
    if (!ability.can(LessonActions.READ_LESSONS, LessonSubject.NAME)) {
      throw new ForbiddenException(errors.forbiddenAccess('Permission denied'));
    }

    const userRoles = dbUser.roles.map((role) => role.name);
    if (userRoles.includes(PredefinedRoles.ADMIN)) {
      const data = await this.lessonRepository.find({
        where: {
          cohort: { id: cohortId },
        },
        relations: {
          course: { instructor: { user: true } },
          cohort: true,
        },
        order: { date: 'ASC' },
      });

      return data;
    }
    if (userRoles.includes(PredefinedRoles.SUPER_ADMIN)) {
      const data = await this.lessonRepository.find({
        where: {
          cohort: { id: cohortId },
        },
        relations: {
          course: { instructor: { user: true } },
          cohort: true,
        },
        order: { date: 'ASC' },
      });

      return data;
    }

    if (userRoles.includes(PredefinedRoles.INSTRUCTOR)) {
      const instructor = await this.instructorRepository.findOneBy({
        user: { id: dbUser.id },
      });

      if (!instructor) {
        throw new NotFoundException(errors.notFound('Instructor not found'));
      }

      const data = await this.lessonRepository.find({
        where: {
          cohort: { id: cohortId },
          course: {
            instructor: { id: instructor.id },
          },
        },
        relations: {
          course: { instructor: { user: true } },
          cohort: true,
        },
        order: { date: 'ASC' },
      });

      return data;
    }

    if (userRoles.includes(PredefinedRoles.STUDENT)) {
      const student = await this.studentRepository.findOne({
        where: { user: { id: dbUser.id } },
      });

      if (!student) {
        throw new NotFoundException(errors.notFound('Student not found'));
      }

      const lessons = await this.lessonRepository.find({
        where: {
          course: {
            cohortCourses: {
              cohort: { id: cohortId },
              enrollments: { student: { user: { id: user.id } } },
            },
          },
        },
        relations: {
          course: { instructor: { user: true } },
        },
        order: { date: 'ASC' },
      });

      if (!lessons.length) return [];

      const lessonIds = lessons.map((lesson) => lesson.id);

      const attendanceRecords = await this.attendanceRepository.find({
        where: {
          lesson: { id: In(lessonIds) },
          student: { id: student.id },
        },
        relations: {
          lesson: true, // ✅ Ensure lesson is loaded
        },
      });

      const attendedLessonIds = new Set(
        attendanceRecords.map((att) => att.lesson.id)
      );

      const lessonsWithFlags = lessons.map((lesson) => ({
        ...lesson,
        hasMarkedAttendance: attendedLessonIds.has(lesson.id),
      }));

      return lessonsWithFlags as (Lesson & { hasMarkedAttendance: boolean })[];
    }
  }

  async markAsCompleted(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
    if (!lesson) {
      throw new NotFoundException(errors.notFound('Lesson not found'));
    }

    lesson.isCompleted = true;
    return this.lessonRepository.save(lesson);
  }

  async findOne(id: string, user: CurrentUserInfo): Promise<Lesson | null> {
    return this.lessonRepository.findOne({
      where: { id },
      relations: {
        course: true,
        cohort: true,
      },
    });
  }

  async getStudentAttendanceInLesson(lessonId: string): Promise<any> {
    const lesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')

      // Join only active cohortCourse
      .leftJoinAndSelect(
        'course.cohortCourses',
        'cohortCourse',
        'cohortCourse.courseId = course.id'
      )
      .leftJoinAndSelect(
        'cohortCourse.cohort',
        'cohort',
        'cohort.isActive = :activeStatus',
        {
          activeStatus: true,
        }
      )

      // Enrollments and Students in the active cohortCourse
      .leftJoinAndSelect('cohortCourse.enrollments', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.user', 'user')

      // Attendance records for enrolled students
      .leftJoinAndSelect(
        'lesson.attendances',
        'attendance',
        'attendance.studentId = student.id'
      )
      .leftJoinAndSelect('attendance.student', 'attendingStudent')
      .leftJoinAndSelect('attendingStudent.user', 'attendingUser')

      .where('lesson.id = :lessonId', { lessonId })
      .getOne();

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrolledStudents = lesson.course.cohortCourses
      // Only use cohortCourses whose cohort is active
      .filter((cc) => cc.cohort?.status === CohortStatus.ACTIVE)
      .flatMap((cc) => cc.enrollments)
      .map((enrollment) => enrollment.student);

    const studentAttendances = enrolledStudents.map((student) => {
      const foundAttendance = lesson.attendances?.find(
        (a) => a.student?.id === student.id
      );

      return {
        student,
        attendance: foundAttendance ?? {},
      };
    });

    return {
      ...lesson,
      attendances: studentAttendances,
    };
  }

  /* async getStudentAttendanceInLesson(lessonId: string): Promise<Lesson | null> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: [
        'course',
        'course.cohortCourses',
        'course.cohortCourses.enrollments',
        'course.cohortCourses.enrollments.student',
        'course.cohortCourses.enrollments.student.user',
        'attendances',
        'attendances.student',
        'attendances.student.user',
      ],
    });
    if (!lesson) {
      throw new NotFoundException(errors.notFound('Lesson not found'));
    }

    return lesson;
  } */

  remove(id: string) {
    return `This action removes a #${id} lesson`;
  }

  /* async generateLessonsForCohort(
    cohort: Cohort,
    entityManager: EntityManager
  ): Promise<void> {
    const courses = await entityManager.getRepository(Course).find({
      relations: ['schedules'],
    });

    for (const course of courses) {
      for (const schedule of course.schedules) {
        const dates = this.generateLessonDates(
          cohort.startDate,
          cohort.endDate,
          schedule.dayOfWeek
        );

        const lessons = dates.map((date) =>
          this.lessonRepository.create({
            date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            cohort,
            course,
          })
        );

        await this.lessonRepository.save(lessons);
      }
    }
  } */

  private generateLessonDates(
    startDate: Date,
    endDate: Date,
    dayOfWeek: number
  ): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      if (current.getDay() === dayOfWeek) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}
