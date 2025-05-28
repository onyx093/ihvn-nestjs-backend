import { Test, TestingModule } from '@nestjs/testing';
import { CohortCoursesController } from './cohort-courses.controller';
import { CohortCoursesService } from './cohort-courses.service';

describe('CohortCoursesController', () => {
  let controller: CohortCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CohortCoursesController],
      providers: [CohortCoursesService],
    }).compile();

    controller = module.get<CohortCoursesController>(CohortCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
