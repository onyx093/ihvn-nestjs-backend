import { Course } from '../../courses/entities/course.entity';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'cohort_courses' })
export class CohortCourse extends AbstractEntity<CohortCourse> {
  @ManyToOne(() => Cohort, (cohort) => cohort.cohortCourses)
  cohort: Cohort;

  @ManyToOne(() => Course, (course) => course.cohortCourses)
  @JoinColumn() // Optional: Only if your column name differs
  course: Course;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
