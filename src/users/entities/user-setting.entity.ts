import { AbstractEntity } from 'src/database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user-settings' })
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
