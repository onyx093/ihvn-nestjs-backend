import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserSetting } from './user-setting.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Comment } from './comment.entity';
import { Role } from '../../enums/role.enum';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  hashedRefreshToken?: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @OneToOne(() => UserSetting, { cascade: true })
  @JoinColumn()
  userSetting: UserSetting;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
}
