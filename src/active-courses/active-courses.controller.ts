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
import { ActiveCoursesService } from './active-courses.service';
import { CreateActiveCourseDto } from './dto/create-active-course.dto';
import { UpdateActiveCourseDto } from './dto/update-active-course.dto';
import { Subject } from '@/decorators/subject.decorator';
import {
  ActiveCourseActions,
  ActiveCourseSubject,
} from './actions/active-courses.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';

@Subject(ActiveCourseSubject.NAME)
@Controller('cohorts/:cohortId/active-courses')
@UseGuards(PermissionsGuard)
export class ActiveCoursesController {
  constructor(private readonly activeCoursesService: ActiveCoursesService) {}

  @Permission(ActiveCourseActions.ADD_ACTIVE_COURSES_TO_COHORT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('cohortId') cohortId: string,
    @Body() createActiveCourseDto: CreateActiveCourseDto
  ) {
    return this.activeCoursesService.create(createActiveCourseDto, cohortId);
  }

  @Permission(ActiveCourseActions.READ_ACTIVE_COURSES_FOR_COHORT)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('cohortId') cohortId: string) {
    return this.activeCoursesService.findAll(cohortId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activeCoursesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActiveCourseDto: UpdateActiveCourseDto
  ) {
    return this.activeCoursesService.update(+id, updateActiveCourseDto);
  }

  @Permission(ActiveCourseActions.REMOVE_ACTIVE_COURSES_FROM_COHORT)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.activeCoursesService.remove(id);
  }
}
