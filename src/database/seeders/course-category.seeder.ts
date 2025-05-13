import { CourseCategory } from '../../course-categories/entities/course-category.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CourseCategorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const courseCategoryEntity1 = new CourseCategory({
      name: 'Catering & Hospitality',
      slug: 'catering-hospitality',
    });
    const courseCategoryEntity2 = new CourseCategory({
      name: 'Makeup & Beauty',
      slug: 'makeup-beauty',
    });
    const courseCategoryEntity3 = new CourseCategory({
      name: 'Videography',
      slug: 'videography',
    });
    const courseCategoryEntity4 = new CourseCategory({
      name: 'Photography',
      slug: 'photography',
    });
    const courseCategoryEntity5 = new CourseCategory({
      name: 'Robotics',
      slug: 'robotics',
    });
    const courseCategoryEntity6 = new CourseCategory({
      name: 'IT & Software',
      slug: 'it-software',
    });
    const courseRepository = dataSource.getRepository(CourseCategory);

    await Promise.all([
      courseRepository.save(courseCategoryEntity1),
      courseRepository.save(courseCategoryEntity2),
      courseRepository.save(courseCategoryEntity3),
      courseRepository.save(courseCategoryEntity4),
      courseRepository.save(courseCategoryEntity5),
      courseRepository.save(courseCategoryEntity6),
    ]);
  }
}
