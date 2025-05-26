import { CourseStatus } from '../../enums/course-status.enum';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { CourseSchedule } from '../../course-schedules/entities/course-schedule.entity';
import { ActiveCourse } from '../../active-courses/entities/active-course.entity';

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

  @OneToMany(() => ActiveCourse, (activeCourse) => activeCourse.course)
  activeCourses: ActiveCourse[];
}
