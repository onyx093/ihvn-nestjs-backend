import { WeekDay } from '../../enums/week-day.enum';
import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, Unique } from 'typeorm';

@Entity({ name: 'course_schedules' })
@Unique(['dayOfWeek', 'course'])
export class CourseSchedule extends AbstractEntity<CourseSchedule> {
  @Column({ type: 'enum', enum: WeekDay })
  dayOfWeek: WeekDay;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Course, (course) => course.schedules, { eager: true })
  course: Course;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;
}
