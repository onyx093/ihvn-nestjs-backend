import { CourseStatus } from '../../enums/course-status.enum';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { CourseSchedule } from '../../course-schedules/entities/course-schedule.entity';
import { CohortCourse } from '../../cohort-courses/entities/cohort-course.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'courses' })
export class Course extends AbstractEntity<Course> {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column('int')
  estimatedDurationForCompletion: number;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  publishedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  @OneToMany(() => CourseSchedule, (schedule) => schedule.course)
  schedules: CourseSchedule[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => CohortCourse, (cohortCourse) => cohortCourse.course)
  cohortCourses: CohortCourse[];

  @ManyToOne(() => Instructor, (instructor) => instructor.courses, {
    eager: true,
  })
  instructor: Instructor;

  @ManyToOne(() => User, (user) => user.createdCourses, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
