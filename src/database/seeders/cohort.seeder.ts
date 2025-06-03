import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { slugify } from '../../lib/helpers';
import { CohortCourse } from '../../cohort-courses/entities/cohort-course.entity';
import { Course } from '../../courses/entities/course.entity';

export default class CohortSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const cohortName = 'Batch C, Cohort 2025';
    const cohortEntity = new Cohort({
      name: cohortName,
      slug: slugify(cohortName),
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-06-01'),
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    const cohortRepository = dataSource.getRepository(Cohort);
    const cohortCourseRepository = dataSource.getRepository(CohortCourse);

    const courses = await dataSource.getRepository(Course).find({
      take: 3,
    });

    const savedCohort = await cohortRepository.save(cohortEntity);

    const cohortCoursePromises = courses.map(async (course) => {
      const cohortCourse = new CohortCourse({
        cohort: savedCohort,
        course,
      });
      return await cohortCourseRepository.save(cohortCourse);
    });

    await Promise.all(cohortCoursePromises);
  }
}
