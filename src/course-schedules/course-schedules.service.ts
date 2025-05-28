import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSchedule } from './entities/course-schedule.entity';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { WeekDay } from '@/enums/week-day.enum';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';

@Injectable()
export class CourseSchedulesService {
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly scheduleRepository: Repository<CourseSchedule>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  async create(
    courseId: string,
    createCourseScheduleDto: CreateCourseScheduleDto
  ): Promise<CourseSchedule> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    await this.validateNoOverlap(courseId, createCourseScheduleDto);

    const schedule = this.scheduleRepository.create({
      ...createCourseScheduleDto,
      course,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll(
    courseId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResult<CourseSchedule>> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }

    const { page, limit } = paginationDto;
    const [data, total] = await this.scheduleRepository.findAndCount({
      where: { course: { id: courseId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
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

  async findOne(id: string): Promise<CourseSchedule | null> {
    return this.scheduleRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCourseScheduleDto: UpdateCourseScheduleDto
  ): Promise<CourseSchedule> {
    const courseSchedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!courseSchedule) {
      throw new NotFoundException(errors.notFound('Schedule not found'));
    }

    if (
      updateCourseScheduleDto.dayOfWeek ||
      updateCourseScheduleDto.startTime ||
      updateCourseScheduleDto.endTime
    ) {
      await this.validateNoOverlap(
        courseSchedule.course.id,
        {
          dayOfWeek:
            updateCourseScheduleDto.dayOfWeek ?? courseSchedule.dayOfWeek,
          startTime:
            updateCourseScheduleDto.startTime ?? courseSchedule.startTime,
          endTime: updateCourseScheduleDto.endTime ?? courseSchedule.endTime,
        },
        id
      );
    }

    const updatedCourseSchedule = this.scheduleRepository.merge(
      courseSchedule,
      updateCourseScheduleDto
    );
    return this.scheduleRepository.save(updatedCourseSchedule);
  }

  async remove(id: string): Promise<void> {
    const courseSchedule = await this.scheduleRepository.findOneBy({ id });
    if (!courseSchedule) {
      throw new NotFoundException(errors.notFound('Course schedule not found'));
    }

    await this.scheduleRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const courseSchedule = await this.scheduleRepository.findOneBy({ id });
    if (!courseSchedule) {
      throw new NotFoundException(errors.notFound('Course schedule not found'));
    }
    await this.scheduleRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const courseSchedule = await this.scheduleRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!courseSchedule) {
      throw new NotFoundException(errors.notFound('Course schedule not found'));
    }
    await this.scheduleRepository.restore(id);
  }

  private async validateNoOverlap(
    courseId: string,
    dto: { dayOfWeek: WeekDay; startTime: string; endTime: string },
    excludeId?: string
  ): Promise<void> {
    const existingSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.courseId = :courseId', { courseId })
      .andWhere('schedule.dayOfWeek = :dayOfWeek', {
        dayOfWeek: dto.dayOfWeek,
      })
      .andWhere(excludeId ? 'schedule.id != :excludeId' : '1=1', { excludeId })
      .getMany();

    const newStart = this.timeToMinutes(dto.startTime);
    const newEnd = this.timeToMinutes(dto.endTime);

    const hasConflict = existingSchedules.some((schedule) => {
      const existingStart = this.timeToMinutes(schedule.startTime);
      const existingEnd = this.timeToMinutes(schedule.endTime);
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (hasConflict) {
      throw new ConflictException(
        errors.conflictError('Schedule conflicts with existing course schedule')
      );
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
