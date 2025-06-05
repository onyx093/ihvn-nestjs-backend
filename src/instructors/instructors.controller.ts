import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Subject } from '@/decorators/subject.decorator';
import {
  InstructorActions,
  InstructorSubject,
} from './actions/instructors.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { permission } from 'process';
import { Permission } from '@/decorators/permission.decorator';

@Subject(InstructorSubject.NAME)
@Controller('instructors')
@UseGuards(PermissionsGuard)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Permission(InstructorActions.CREATE_INSTRUCTORS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorsService.create(createInstructorDto);
  }

  @Permission(InstructorActions.READ_INSTRUCTORS)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.instructorsService.findAll(paginationDto);
  }

  @Permission(InstructorActions.READ_ONE_INSTRUCTORS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id);
  }

  @Permission(InstructorActions.UPDATE_INSTRUCTORS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto
  ) {
    return this.instructorsService.update(id, updateInstructorDto);
  }

  @Permission(InstructorActions.DELETE_INSTRUCTORS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.instructorsService.remove(id);
  }
}
