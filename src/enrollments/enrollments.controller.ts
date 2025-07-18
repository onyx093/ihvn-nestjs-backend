import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Subject } from '../decorators/subject.decorator';
import {
  EnrollmentActions,
  EnrollmentSubject,
} from './actions/enrollments.actions';
import { PermissionsGuard } from '../casl/guard/permissions.guard';
import { Permission } from '../decorators/permission.decorator';

@Subject(EnrollmentSubject.NAME)
@Controller('enrollments')
@UseGuards(PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Permission(EnrollmentActions.CREATE_ENROLLMENTS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Permission(EnrollmentActions.READ_ENROLLMENTS)
  @Get('/courses/:courseId')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('courseId') courseId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.enrollmentsService.findAll(courseId, paginationDto);
  }

  @Permission(EnrollmentActions.READ_ONE_ENROLLMENTS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Permission(EnrollmentActions.UPDATE_ENROLLMENTS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Permission(EnrollmentActions.DELETE_ENROLLMENTS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }

  @Permission(EnrollmentActions.SOFT_DELETE_ENROLLMENTS)
  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.enrollmentsService.softDelete(id);
  }

  @Permission(EnrollmentActions.RESTORE_ENROLLMENTS)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.enrollmentsService.restore(id);
  }
}
