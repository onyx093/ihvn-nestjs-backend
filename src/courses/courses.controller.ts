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
  NotFoundException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Subject } from '@/decorators/subject.decorator';
import { CourseActions, CourseSubject } from './actions/courses.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';
import errors from '@/config/errors.config';

@Subject(CourseSubject.NAME)
@Controller('courses')
@UseGuards(PermissionsGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Permission(CourseActions.CREATE_COURSES)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  @Permission(CourseActions.READ_COURSES)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.coursesService.findAll();
  }

  @Permission(CourseActions.READ_ONE_COURSES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException(errors.notFound('Course not found'));
    }
    return course;
  }

  @Permission(CourseActions.UPDATE_COURSES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Permission(CourseActions.DELETE_COURSES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
