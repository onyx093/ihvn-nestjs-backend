import { Lesson } from '../../lesson/entities/lesson.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { CohortCourse } from '../../cohort-courses/entities/cohort-course.entity';

@Entity({ name: 'cohorts' })
export class Cohort extends AbstractEntity<Cohort> {
  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column()
  year: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.cohort)
  enrollments: Enrollment[];

  @OneToMany(() => CohortCourse, (cohortCourse) => cohortCourse.cohort)
  cohortCourses: CohortCourse[];

  @OneToMany(() => Lesson, (lesson) => lesson.cohort)
  lessons: Lesson[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;
}
