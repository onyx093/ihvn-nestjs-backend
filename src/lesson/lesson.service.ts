import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) {}

  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lesson';
  }

  findAll() {
    return `This action returns all lesson`;
  }

  findOne(id: string) {
    return `This action returns a #${id} lesson`;
  }

  update(id: string, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: string) {
    return `This action removes a #${id} lesson`;
  }

  async generateLessonsForCohort(
    cohort: Cohort,
    entityManager: EntityManager
  ): Promise<void> {
    const courses = await entityManager.getRepository(Course).find({
      relations: ['course_schedules'],
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
  }

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
