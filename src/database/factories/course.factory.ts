import { slugify } from '../../lib/helpers';
import { Course } from '../../courses/entities/course.entity';
import { setSeederFactory } from 'typeorm-extension';
import { CourseStatus } from '../../enums/course-status.enum';

export const CourseFactory = setSeederFactory(
  Course,
  (fakerEN, context: Partial<Course> = {}) => {
    // faker;
    const course = new Course({});
    // Use custom data if provided; otherwise, use faker defaults.
    const courseName = fakerEN.lorem.word();

    course.name = context.name || courseName;
    course.slug = context.slug || slugify(courseName);
    course.description = context.description || fakerEN.lorem.sentences(3);
    course.thumbnail = context.thumbnail || fakerEN.image.imageUrl();
    course.estimatedDurationForCompletion =
      context.estimatedDurationForCompletion || fakerEN.datatype.number(8);
    course.status =
      context.status ||
      fakerEN.helpers.arrayElement([
        CourseStatus.DRAFT,
        CourseStatus.PUBLISHED,
      ]);
    course.createdAt = context.createdAt || new Date();
    course.updatedAt = context.updatedAt || new Date();
    course.publishedAt = context.publishedAt || null;
    course.deletedAt = context.deletedAt || null;
    return course;
  }
);
