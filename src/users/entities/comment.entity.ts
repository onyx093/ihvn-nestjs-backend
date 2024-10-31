import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'comments' })
export class Comment extends AbstractEntity<Comment> {
  @Column()
  content: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
