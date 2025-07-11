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
import { Account } from './account.entity';
import { Course } from '../../courses/entities/course.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Exclude()
  @Column({ select: false, default: null })
  hashedRefreshToken?: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  otp: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  otpExpiry: Date;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToOne(() => UserSetting, { cascade: true })
  @JoinColumn()
  userSetting: UserSetting;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
  })
  account: Account;

  @OneToMany(() => Course, (course) => course.createdBy)
  createdCourses: Course[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];
}
