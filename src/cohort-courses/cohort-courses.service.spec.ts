import { Test, TestingModule } from '@nestjs/testing';
import { CohortCoursesService } from './cohort-courses.service';

describe('ActiveCoursesService', () => {
  let service: CohortCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CohortCoursesService],
    }).compile();

    service = module.get<CohortCoursesService>(CohortCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
