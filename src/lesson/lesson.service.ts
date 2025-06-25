import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { WeekDay, WeekDaysList } from '@/enums/week-day.enum';
import errors from '@/config/errors.config';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Cohort)
    private cohortRepository: Repository<Cohort>
  ) {}

  async generateLessonsForActiveCohort(cohortId: string): Promise<void> {
    const activeCohort = await this.cohortRepository.findOne({
      where: { id: cohortId, isActive: true },
      relations: [
        'cohortCourses',
        'cohortCourses.course',
        'cohortCourses.course.schedules',
      ],
    });

    if (!activeCohort) {
      throw new NotFoundException(errors.notFound('No active cohort found'));
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

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        console.log(
          'd',
          d.toLocaleDateString('en-US', {
            weekday: 'long',
          })
        );

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
              course,
              cohort: activeCohort,
              date: new Date(dateStr),
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            });

            console.log('lesson', lesson);
            preparedLessons.push(lesson);

            // await this.lessonRepository.save(lesson);
          }
        }
      }
    }

    await this.lessonRepository.save(preparedLessons);
  }

  async generateLessonsForCourseInCohort(courseId: string, cohortId: string) {
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
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Lesson>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.lessonRepository.findAndCount({
      where: { cohort: { id: cohortId } },
      relations: ['course', 'cohort'],
      order: { date: 'ASC' },
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

  async markAsCompleted(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
    if (!lesson) {
      throw new NotFoundException(errors.notFound('Lesson not found'));
    }

    lesson.isCompleted = true;
    return this.lessonRepository.save(lesson);
  }

  async findOne(id: string): Promise<Lesson | null> {
    return this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'cohort'],
    });
  }

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
