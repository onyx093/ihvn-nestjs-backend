import { Course } from '../../courses/entities/course.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const courseEntity = new Course({
      title: 'Course Title',
      slug: 'course-title',
      courseInstructor: 'Course Instructor',
      description: 'Course Description',
      price: 100.0,
    });
    const courseRepository = dataSource.getRepository(Course);
    // const courseFactory = await factoryManager.get(Course).make(courseEntity);
    await courseRepository.save(courseEntity);
  }
}
