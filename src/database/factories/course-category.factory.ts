import { slugify } from '../../lib/helpers';
import { setSeederFactory } from 'typeorm-extension';
import { CourseCategory } from '../../course-categories/entities/course-category.entity';

export const CourseCategoryFactory = setSeederFactory(
  CourseCategory,
  (fakerEN, context: Partial<CourseCategory> = {}) => {
    // faker;
    const courseCategory = new CourseCategory({});
    // Use custom data if provided; otherwise, use faker defaults.
    const courseCategoryName = fakerEN.lorem.word();

    courseCategory.name = context.name || courseCategoryName;
    courseCategory.slug = slugify(context.name) || slugify(courseCategoryName);
    courseCategory.courses = context.courses || [];
    return courseCategory;
  }
);
