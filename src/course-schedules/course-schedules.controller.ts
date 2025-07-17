import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CourseSchedulesService } from './course-schedules.service';
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import {
  CourseScheduleActions,
  CourseScheduleSubject,
} from './actions/course-schedules.actions';
import { Subject } from '../decorators/subject.decorator';
import { PermissionsGuard } from '../casl/guard/permissions.guard';
import { Permission } from '../decorators/permission.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Subject(CourseScheduleSubject.NAME)
@Controller('courses/:courseId/schedules')
@UseGuards(PermissionsGuard)
export class CourseSchedulesController {
  constructor(
    private readonly courseSchedulesService: CourseSchedulesService
  ) {}

  @Permission(CourseScheduleActions.CREATE_COURSE_SCHEDULES)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('courseId') courseId: string,
    @Body() createCourseScheduleDto: CreateCourseScheduleDto
  ) {
    return this.courseSchedulesService.create(
      courseId,
      createCourseScheduleDto
    );
  }

  @Permission(CourseScheduleActions.READ_COURSE_SCHEDULES)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('courseId') courseId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.courseSchedulesService.findAll(courseId, paginationDto);
  }

  @Permission(CourseScheduleActions.READ_ONE_COURSE_SCHEDULES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @Param('courseId') courseId?: string) {
    return this.courseSchedulesService.findOne(id, courseId);
  }

  @Permission(CourseScheduleActions.UPDATE_COURSE_SCHEDULES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCourseScheduleDto: UpdateCourseScheduleDto
  ) {
    return this.courseSchedulesService.update(id, updateCourseScheduleDto);
  }

  @Permission(CourseScheduleActions.DELETE_COURSE_SCHEDULES)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.courseSchedulesService.remove(id);
  }

  @Permission(CourseScheduleActions.SOFT_DELETE_COURSE_SCHEDULES)
  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.courseSchedulesService.softDelete(id);
  }

  @Permission(CourseScheduleActions.RESTORE_COURSE_SCHEDULES)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.courseSchedulesService.restore(id);
  }
}
