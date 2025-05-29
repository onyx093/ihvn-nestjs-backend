import { CourseStatus } from '../../enums/course-status.enum';
import { Course } from '../../courses/entities/course.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../../roles/entities/role.entity';
import { PredefinedRoles } from '../../enums/role.enum';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../users/entities/account.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const instructorRepository = dataSource.getRepository(Instructor);
    const courseRepository = dataSource.getRepository(Course);

    const instructorRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.INSTRUCTOR,
    });

    const instructorUser = {
      name: 'Kenneth Doe',
      username: 'kenneth',
      email: 'kenneth@example.com',
      roles: [instructorRole],
    };

    const instructorFactory = await factoryManager
      .get(User)
      .make(instructorUser);
    instructorFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: false,
      isAccountGenerated: false,
    });

    const instructorEntityFactory = await factoryManager.get(Instructor).make({
      user: instructorFactory,
    });

    await userRepository.save(instructorFactory);
    await instructorRepository.save(instructorEntityFactory);

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
      instructor: instructorEntityFactory,
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
      instructor: instructorEntityFactory,
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
      instructor: instructorEntityFactory,
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
      instructor: instructorEntityFactory,
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
      instructor: instructorEntityFactory,
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
      instructor: instructorEntityFactory,
    });

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
