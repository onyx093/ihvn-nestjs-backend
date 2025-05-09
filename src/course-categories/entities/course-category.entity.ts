import { Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { Course } from '../../courses/entities/course.entity';

export class CourseCategory extends AbstractEntity<CourseCategory> {
  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];
}
