import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_settings' })
export class UserSetting extends AbstractEntity<UserSetting> {
  @Column({ default: 'light' })
  theme: string;

  @Column()
  notificationsEnabled: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
