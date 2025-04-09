import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { User } from './user.entity';

@Entity({ name: 'accounts' })
export class Account extends AbstractEntity<Account> {
  @Column({ default: true })
  firstTimeLogin: boolean;

  @Column({ default: true })
  isAccountGenerated: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn() // Creates a 'userId' column in the Account table
  user: User;
}
