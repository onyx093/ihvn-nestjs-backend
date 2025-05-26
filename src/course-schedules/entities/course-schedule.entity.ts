import { WeekDay } from '../../enums/week-day.enum';
import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'course_schedules' })
export class CourseSchedule extends AbstractEntity<CourseSchedule> {
  @Column({ type: 'enum', enum: WeekDay })
  dayOfWeek: WeekDay;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Course, (course) => course.schedules)
  course: Course;
}
