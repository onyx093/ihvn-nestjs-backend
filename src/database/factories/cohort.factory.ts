import { slugify } from '../../lib/helpers';
import { setSeederFactory } from 'typeorm-extension';
import { Cohort } from '../../cohorts/entities/cohort.entity';
import { CohortStatus } from '../../enums/cohort-status.enum';

export const CohortFactory = setSeederFactory(
  Cohort,
  (fakerEN, context: Partial<Cohort> = {}) => {
    // faker;
    const cohort = new Cohort({});
    // Use custom data if provided; otherwise, use faker defaults.
    const cohortName = fakerEN.lorem.word();

    const cohortYear = fakerEN.date.future().getFullYear();
    console.log(`Cohort Name: ${cohortName}, Year: ${cohortYear}`);

    cohort.name = context.name || cohortName;
    cohort.slug = context.slug || slugify(cohortName);
    cohort.startDate = context.startDate || new Date('2025-06-01');
    cohort.endDate = context.endDate || new Date('2026-06-01');
    cohort.isActive = context.isActive || false;
    cohort.status =
      context.status ||
      fakerEN.helpers.arrayElement([
        CohortStatus.ACTIVE,
        CohortStatus.DRAFT,
        CohortStatus.CANCELLED,
        CohortStatus.COMPLETED,
      ]);
    cohort.createdAt = context.createdAt || new Date();
    cohort.updatedAt = context.updatedAt || new Date();
    cohort.deletedAt = context.deletedAt || null;
    return cohort;
  }
);
