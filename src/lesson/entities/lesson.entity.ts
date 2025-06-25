import { Cohort } from '../../cohorts/entities/cohort.entity';
import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Unique(['date', 'cohort', 'course'])
@Entity({ name: 'lessons' })
export class Lesson extends AbstractEntity<Lesson> {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Cohort, (cohort) => cohort.lessons, { eager: true })
  cohort: Cohort;

  @ManyToOne(() => Course, (course) => course.lessons, { eager: true })
  course: Course;

  @Column({ default: false })
  isCompleted: boolean;
}
