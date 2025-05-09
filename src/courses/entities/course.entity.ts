import { CourseCategory } from '../../course-categories/entities/course-category.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'courses' })
export class Course extends AbstractEntity<Course> {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column('int')
  estimatedDurationForCompletion: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => CourseCategory, (category) => category.courses)
  category: CourseCategory;
}
