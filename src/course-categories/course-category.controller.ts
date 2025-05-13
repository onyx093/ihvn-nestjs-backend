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
} from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { Subject } from '@/decorators/subject.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import {
  CourseCategoryActions,
  CourseCategorySubject,
} from './actions/course-categories.actions';
import { Permission } from '@/decorators/permission.decorator';
import errors from '@/config/errors.config';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Subject(CourseCategorySubject.NAME)
@Controller('course-categories')
@UseGuards(PermissionsGuard)
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Permission(CourseCategoryActions.CREATE_COURSE_CATEGORIES)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return await this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Permission(CourseCategoryActions.READ_COURSE_CATEGORIES)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.courseCategoryService.findAll(paginationDto);
  }

  @Permission(CourseCategoryActions.READ_ONE_COURSE_CATEGORIES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const courseCategory = await this.courseCategoryService.findOne(id);
    if (!courseCategory) {
      throw new NotFoundException(errors.notFound('Category not found'));
    }
    return courseCategory;
  }

  @Permission(CourseCategoryActions.UPDATE_COURSE_CATEGORIES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto
  ) {
    return await this.courseCategoryService.update(id, updateCourseCategoryDto);
  }

  @Permission(CourseCategoryActions.DELETE_COURSE_CATEGORIES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.courseCategoryService.remove(id);
  }
}
