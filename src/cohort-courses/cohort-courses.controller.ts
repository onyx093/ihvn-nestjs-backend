import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CohortCoursesService } from './cohort-courses.service';
import { CreateCohortCourseDto } from './dto/create-cohort-course.dto';
import { UpdateCohortCourseDto } from './dto/update-cohort-course.dto';
import { Subject } from '@/decorators/subject.decorator';
import {
  CohortCourseActions,
  CohortCourseSubject,
} from './actions/cohort-courses.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';

@Subject(CohortCourseSubject.NAME)
@Controller('cohorts/:cohortId/active-courses')
@UseGuards(PermissionsGuard)
export class CohortCoursesController {
  constructor(private readonly cohortCoursesService: CohortCoursesService) {}

  @Permission(CohortCourseActions.ADD_COHORT_COURSES_TO_COHORT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('cohortId') cohortId: string,
    @Body() createCohortCourseDto: CreateCohortCourseDto
  ) {
    return this.cohortCoursesService.create(createCohortCourseDto, cohortId);
  }

  @Permission(CohortCourseActions.READ_COHORT_COURSES_FOR_COHORT)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('cohortId') cohortId: string) {
    return this.cohortCoursesService.findAll(cohortId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cohortCoursesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCohortCourseDto: UpdateCohortCourseDto
  ) {
    return this.cohortCoursesService.update(+id, updateCohortCourseDto);
  }

  @Permission(CohortCourseActions.REMOVE_COHORT_COURSES_FROM_COHORT)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.cohortCoursesService.remove(id);
  }
}
