import { Attendance } from '../../attendance/entities/attendance.entity';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { Course } from '../../courses/entities/course.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

@Unique(['date', 'cohort', 'course'])
@Entity({ name: 'lessons' })
export class Lesson extends AbstractEntity<Lesson> {
  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  colorCode: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Cohort)
  cohort: Cohort;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => Attendance, (attendance) => attendance.lesson)
  attendances: Attendance[];
}
