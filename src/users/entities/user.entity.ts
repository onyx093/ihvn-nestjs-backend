import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserSetting } from './user-setting.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Role } from '../../roles/entities/role.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: null })
  hashedRefreshToken?: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiry: Date;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToOne(() => UserSetting, { cascade: true })
  @JoinColumn()
  userSetting: UserSetting;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];
}
