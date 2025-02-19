import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserSetting } from './user-setting.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Role } from '../../enums/role.enum';

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

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.GUEST,
  })
  role: Role;
}
