import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { slugify } from '../../lib/helpers';
import { CohortCourse } from '../../cohort-courses/entities/cohort-course.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseStatus } from '../../enums/course-status.enum';
import { CohortStatus } from '../../enums/cohort-status.enum';
import { Role } from '../../roles/entities/role.entity';
import { PredefinedRoles } from '../../enums/role.enum';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { Account } from '../../users/entities/account.entity';
import { faker } from '@faker-js/faker';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

export default class CohortSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const cohortName1 = 'Batch A, Cohort 2025';
    const cohortName2 = 'Batch B, Cohort 2025';
    const cohortName3 = 'Batch C, Cohort 2025';

    const cohortEntity1 = new Cohort({
      name: cohortName1,
      slug: slugify(cohortName1),
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-04-30'),
      isActive: false,
      status: CohortStatus.COMPLETED,
      createdAt: new Date('2024-12-26'),
      updatedAt: new Date('2024-12-26'),
      deletedAt: null,
    });

    const cohortEntity2 = new Cohort({
      name: cohortName2,
      slug: slugify(cohortName2),
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-08-30'),
      isActive: true,
      status: CohortStatus.ACTIVE,
      createdAt: new Date('2025-03-12'),
      updatedAt: new Date('2025-03-12'),
      deletedAt: null,
    });

    const cohortEntity3 = new Cohort({
      name: cohortName3,
      slug: slugify(cohortName3),
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-30'),
      isActive: false,
      status: CohortStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    const cohortRepository = dataSource.getRepository(Cohort);
    const cohortCourseRepository = dataSource.getRepository(CohortCourse);
    const userRepository = dataSource.getRepository(User);

    const courses1 = await dataSource
      .getRepository(Course)
      .createQueryBuilder('course')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('RANDOM()')
      .take(4)
      .getMany();
    const courses2 = await dataSource
      .getRepository(Course)
      .createQueryBuilder('course')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('RANDOM()')
      .take(3)
      .getMany();
    const courses3 = await dataSource
      .getRepository(Course)
      .createQueryBuilder('course')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('RANDOM()')
      .take(2)
      .getMany();

    const savedCohort1 = await cohortRepository.save(cohortEntity1);
    const savedCohort2 = await cohortRepository.save(cohortEntity2);
    const savedCohort3 = await cohortRepository.save(cohortEntity3);

    const cohortCoursePromises1 = courses1.map(async (course) => {
      const cohortCourse = new CohortCourse({
        cohort: savedCohort1,
        course,
      });
      return await cohortCourseRepository.save(cohortCourse);
    });

    const cohortCoursePromises2 = courses2.map(async (course) => {
      const cohortCourse = new CohortCourse({
        cohort: savedCohort2,
        course,
      });
      return await cohortCourseRepository.save(cohortCourse);
    });

    const cohortCoursePromises3 = courses3.map(async (course) => {
      const cohortCourse = new CohortCourse({
        cohort: savedCohort3,
        course,
      });
      return await cohortCourseRepository.save(cohortCourse);
    });

    await Promise.all([
      ...cohortCoursePromises1,
      ...cohortCoursePromises2,
      ...cohortCoursePromises3,
    ]);

    const studentRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.STUDENT,
    });

    const studentUsers = [];

    for (let i = 0; i < 50; i++) {
      let studentName = faker.person.firstName();
      let email = `${studentName.toLowerCase()}@example.com`;
      while (true) {
        const exists = await userRepository.findOne({ where: { email } });
        if (!exists) {
          break;
        } else {
          console.log('Duplicate found', studentName, email);
          studentName = faker.person.firstName();
          email = `${studentName.toLowerCase()}@example.com`;
        }
      }
      studentUsers.push({
        name: `${studentName} ${faker.person.firstName()}`,
        username: studentName.toLowerCase(),
        email: `${studentName.toLowerCase()}@example.com`,
        roles: [studentRole],
      });
    }

    const studentRepository = dataSource.getRepository(Student);
    const enrollmentRepository = dataSource.getRepository(Enrollment);
    await new Promise((r) => setTimeout(r, 1000));
    const cohortCourses = await dataSource
      .getRepository(CohortCourse)
      .find({ relations: ['cohort'] });

    let counter = 1;

    for (const studentUser of studentUsers) {
      const userFactory = await factoryManager.get(User).make(studentUser);
      userFactory.account = await factoryManager.get(Account).make({
        firstTimeLogin: faker.datatype.boolean({ probability: 0.75 }),
        isAccountGenerated: faker.datatype.boolean({ probability: 0.5 }),
      });

      const savedUser = await userRepository.save(userFactory);
      const studentEntityFactory = await factoryManager.get(Student).make({
        user: savedUser,
        referenceNumber: `IHVN-${new Date().getFullYear()}-00${++counter}`,
      });

      const savedStudent = await studentRepository.save(studentEntityFactory);

      const randomCohort = faker.helpers.arrayElement([
        savedCohort1,
        savedCohort2,
        savedCohort3,
      ]);

      const randomCohortCourse = cohortCourses.find(
        (cc) => cc.cohort.id === randomCohort.id
      );

      const enrollment = new Enrollment({
        student: savedStudent,
        cohort: randomCohort,
        cohortCourse: randomCohortCourse,
      });
      await enrollmentRepository.save(enrollment);
    }
  }
}
