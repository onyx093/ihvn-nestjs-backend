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
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Subject } from '@/decorators/subject.decorator';
import { CourseActions, CourseSubject } from './actions/courses.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileCleanupInterceptor } from '@/interceptors/file-cleanup.interceptor';

@Subject(CourseSubject.NAME)
@Controller('courses')
@UseGuards(PermissionsGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Permission(CourseActions.CREATE_COURSES)
  @UseInterceptors(FileInterceptor('thumbnail'), FileCleanupInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto
  ) {
    return await this.coursesService.create(createCourseDto, file);
  }

  @Permission(CourseActions.READ_COURSES)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.coursesService.findAll(paginationDto);
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
  @UseInterceptors(FileInterceptor('thumbnail'), FileCleanupInterceptor)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    return await this.coursesService.update(id, updateCourseDto, file);
  }

  @Permission(CourseActions.DELETE_COURSES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
