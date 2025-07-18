import { Test, TestingModule } from '@nestjs/testing';
import { CourseSchedulesController } from './course-schedules.controller';
import { CourseSchedulesService } from './course-schedules.service';

describe('CourseSchedulesController', () => {
  let controller: CourseSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseSchedulesController],
      providers: [CourseSchedulesService],
    }).compile();

    controller = module.get<CourseSchedulesController>(CourseSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
