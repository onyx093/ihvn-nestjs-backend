import { User } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity({ name: 'students' })
export class Student extends AbstractEntity<Student> {
  @OneToOne(() => User)
  @JoinColumn() // Creates a 'userId' column in the Student table
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
