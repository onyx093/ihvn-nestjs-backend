import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { WeekType } from '../../enums/attendance.enum';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'attendances' })
export class Attendance extends AbstractEntity<Attendance> {
  @Column({ name: 'userId' })
  @Index({ unique: true })
  userId: string;

  // The date for the attendance record.
  @Column({ type: 'date' })
  date: string;

  // Clock in timestamp.
  @Column({ type: 'timestamp', nullable: true })
  clockIn: Date;

  // Clock out timestamp.
  @Column({ type: 'timestamp', nullable: true })
  clockOut: Date;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Week type (MON_FRI or MON_SAT).
  @Column({
    type: 'enum',
    enum: WeekType,
    default: WeekType.MON_FRI,
  })
  weekType: WeekType;
}
