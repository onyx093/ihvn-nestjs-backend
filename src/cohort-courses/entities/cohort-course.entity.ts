import { Course } from '../../courses/entities/course.entity';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity({ name: 'cohort_courses' })
export class CohortCourse extends AbstractEntity<CohortCourse> {
  @ManyToOne(() => Cohort, (cohort) => cohort.cohortCourses, { eager: true })
  @JoinColumn() // Optional: Only if your column name differs
  cohort: Cohort;

  @ManyToOne(() => Course, (course) => course.cohortCourses, { eager: true })
  @JoinColumn() // Optional: Only if your column name differs
  course: Course;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.cohortCourse)
  enrollments: Enrollment[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
