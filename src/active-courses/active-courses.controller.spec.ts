import { Test, TestingModule } from '@nestjs/testing';
import { ActiveCoursesController } from './active-courses.controller';
import { ActiveCoursesService } from './active-courses.service';

describe('ActiveCoursesController', () => {
  let controller: ActiveCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveCoursesController],
      providers: [ActiveCoursesService],
    }).compile();

    controller = module.get<ActiveCoursesController>(ActiveCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
