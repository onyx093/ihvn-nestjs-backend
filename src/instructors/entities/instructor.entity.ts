import { AbstractEntity } from '../../database/entities/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity({ name: 'instructors' })
export class Instructor extends AbstractEntity<Instructor> {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
}
