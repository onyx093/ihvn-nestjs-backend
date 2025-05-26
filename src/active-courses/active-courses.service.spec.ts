import { Test, TestingModule } from '@nestjs/testing';
import { ActiveCoursesService } from './active-courses.service';

describe('ActiveCoursesService', () => {
  let service: ActiveCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveCoursesService],
    }).compile();

    service = module.get<ActiveCoursesService>(ActiveCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
