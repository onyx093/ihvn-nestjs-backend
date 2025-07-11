import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { Student } from '../../students/entities/student.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { AttendanceStatus } from '../../enums/attendance.enum';

@Entity({ name: 'attendances' })
@Unique(['lesson', 'student'])
export class Attendance extends AbstractEntity<Attendance> {
  @ManyToOne(() => Lesson)
  lesson: Lesson;

  @ManyToOne(() => Student)
  student: Student;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ default: false })
  instructorConfirmed: boolean;

  @ManyToOne(() => Instructor, { nullable: true })
  @JoinColumn({ name: 'confirmedBy' })
  confirmedBy: Instructor;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  studentMarkedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
