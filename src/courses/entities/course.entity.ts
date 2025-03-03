import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'courses' })
export class Course extends AbstractEntity<Course> {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  courseInstructor: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
