import { Course } from '../../courses/entities/course.entity';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'active_courses' })
export class ActiveCourse extends AbstractEntity<ActiveCourse> {
  @ManyToOne(() => Cohort, (cohort) => cohort.activeCourses)
  cohort: Cohort;

  @ManyToOne(() => Course, (course) => course.activeCourses)
  @JoinColumn() // Optional: Only if your column name differs
  course: Course;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
