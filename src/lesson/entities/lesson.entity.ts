import { Cohort } from '../../cohorts/entities/cohort.entity';
import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson extends AbstractEntity<Lesson> {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Cohort, (cohort) => cohort.lessons)
  cohort: Cohort;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;
}
