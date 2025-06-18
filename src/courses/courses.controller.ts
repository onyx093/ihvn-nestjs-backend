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
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CurrentUserInfo } from '@/common/interfaces/current-user-info.interface';
import { SearchCourseDto } from './dto/search-course.dto';

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
    @UploadedFile('thumbnail') file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: CurrentUserInfo
  ) {
    return await this.coursesService.create(createCourseDto, file, user);
  }

  @Permission(CourseActions.READ_COURSES)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserInfo
  ) {
    return await this.coursesService.findAll(paginationDto, user);
  }

  @Permission(CourseActions.SEARCH_COURSES)
  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCourseDto: SearchCourseDto,
    @CurrentUser() user: CurrentUserInfo
  ) {
    return await this.coursesService.searchCoursesByRole(searchCourseDto, user);
  }

  @Permission(CourseActions.READ_ONE_COURSES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserInfo) {
    const course = await this.coursesService.findOneByUser(id, user);
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
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: CurrentUserInfo
  ) {
    return await this.coursesService.update(id, updateCourseDto, file, user);
  }

  @Permission(CourseActions.DELETE_COURSES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }

  @Permission(CourseActions.SOFT_DELETE_COURSES)
  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.coursesService.softDelete(id);
  }

  @Permission(CourseActions.RESTORE_COURSES)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.coursesService.restore(id);
  }

  @Permission(CourseActions.PUBLISH_COURSES)
  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string) {
    return this.coursesService.publish(id);
  }

  @Permission(CourseActions.UNPUBLISH_COURSES)
  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string) {
    return this.coursesService.unpublish(id);
  }

  @Permission(CourseActions.ENROLL_COURSES)
  @Post(':id/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enroll(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserInfo
  ): Promise<void> {
    return this.coursesService.enroll(id, user);
  }

  @Permission(CourseActions.UNENROLL_COURSES)
  @Delete(':id/unenroll')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unenroll(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserInfo
  ): Promise<void> {
    return this.coursesService.unenroll(id, user);
  }
}
