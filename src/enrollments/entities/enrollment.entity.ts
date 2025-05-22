import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { CreateDateColumn, Entity, ManyToOne, Unique } from 'typeorm';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'enrollments' })
@Unique(['student', 'cohort'])
export class Enrollment extends AbstractEntity<Enrollment> {
  @ManyToOne(() => Student, (student) => student.enrollments)
  student: Student;

  @ManyToOne(() => Cohort, (cohort) => cohort.enrollments)
  cohort: Cohort;

  @ManyToOne(() => Course)
  course: Course;

  @CreateDateColumn()
  enrolledAt: Date;
}
