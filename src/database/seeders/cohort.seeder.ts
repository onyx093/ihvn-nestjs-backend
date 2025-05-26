import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { slugify } from '../../lib/helpers';

export default class CohortSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const cohortName = 'Batch C, Cohort 2025';
    const cohortEntity = new Cohort({
      name: cohortName,
      slug: slugify(cohortName),
      year: 2025,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-06-01'),
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    const courseRepository = dataSource.getRepository(Cohort);

    await courseRepository.save(cohortEntity);
  }
}
