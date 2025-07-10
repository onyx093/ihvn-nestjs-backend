import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { Student } from '../../students/entities/student.entity';
import { CohortCourse } from '../../cohort-courses/entities/cohort-course.entity';

@Entity({ name: 'enrollments' })
@Unique(['student', 'cohort'])
export class Enrollment extends AbstractEntity<Enrollment> {
  @ManyToOne(() => Student, (student) => student.enrollments, { eager: true })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Cohort, (cohort) => cohort.enrollments, { eager: true })
  @JoinColumn()
  cohort: Cohort;

  @ManyToOne(() => CohortCourse, (cohortCourse) => cohortCourse.enrollments, {
    eager: true,
  })
  @JoinColumn({ name: 'cohortCourseId' })
  cohortCourse: CohortCourse;

  @CreateDateColumn({ default: new Date() })
  enrolledAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  unenrolledAt: Date;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
