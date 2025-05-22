import { CourseStatus } from '../../enums/course-status.enum';
import { Course } from '../../courses/entities/course.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const courseEntity1 = new Course({
      name: 'Catering & Hospitality',
      slug: 'catering-hospitality',
      description: 'Catering & Hospitality Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
      deletedAt: null,
    });
    const courseEntity2 = new Course({
      name: 'Makeup & Beauty',
      slug: 'makeup-beauty',
      description: 'Makeup & Beauty Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      deletedAt: null,
    });
    const courseEntity3 = new Course({
      name: 'Videography',
      slug: 'videography',
      description: 'Videography Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      deletedAt: null,
    });
    const courseEntity4 = new Course({
      name: 'Photography',
      slug: 'photography',
      description: 'Photography Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      deletedAt: null,
    });
    const courseEntity5 = new Course({
      name: 'Robotics',
      slug: 'robotics',
      description: 'Robotics Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      deletedAt: new Date(),
    });
    const courseEntity6 = new Course({
      name: 'IT & Software',
      slug: 'it-software',
      description: 'IT & Software Description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      estimatedDurationForCompletion: 30,
      status: CourseStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      deletedAt: null,
    });
    const courseRepository = dataSource.getRepository(Course);

    await Promise.all([
      courseRepository.save(courseEntity1),
      courseRepository.save(courseEntity2),
      courseRepository.save(courseEntity3),
      courseRepository.save(courseEntity4),
      courseRepository.save(courseEntity5),
      courseRepository.save(courseEntity6),
    ]);
  }
}
