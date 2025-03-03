import { slugify } from '../../lib/helpers';
import { Course } from '../../courses/entities/course.entity';
import { setSeederFactory } from 'typeorm-extension';

export const CourseFactory = setSeederFactory(
  Course,
  (fakerEN, context: Partial<Course> = {}) => {
    // faker;
    const course = new Course({});
    // Use custom data if provided; otherwise, use faker defaults.
    const courseName = fakerEN.lorem.words(3);

    course.title = context.title || courseName;
    course.slug = context.slug || slugify(courseName);
    course.description = context.description || fakerEN.lorem.sentences(3);
    course.courseInstructor =
      context.courseInstructor || fakerEN.person.fullName();
    course.price =
      context.price ||
      parseFloat(fakerEN.finance.amount({ min: 10, max: 100 }));
    return course;
  }
);
