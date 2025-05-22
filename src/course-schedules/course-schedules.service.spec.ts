import { Test, TestingModule } from '@nestjs/testing';
import { CourseSchedulesService } from './course-schedules.service';

describe('CourseSchedulesService', () => {
  let service: CourseSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseSchedulesService],
    }).compile();

    service = module.get<CourseSchedulesService>(CourseSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
