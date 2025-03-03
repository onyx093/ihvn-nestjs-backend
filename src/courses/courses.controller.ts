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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Subject } from '@/decorators/subject.decorator';
import { CourseActions, CourseSubject } from './actions/courses.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';

@Subject(CourseSubject.NAME)
@Controller('courses')
@UseGuards(PermissionsGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Permission(CourseActions.CREATE_COURSES)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Permission(CourseActions.READ_COURSES)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.coursesService.findAll();
  }

  @Permission(CourseActions.READ_ONE_COURSES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Permission(CourseActions.UPDATE_COURSES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Permission(CourseActions.DELETE_COURSES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
