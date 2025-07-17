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
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { Subject } from '../decorators/subject.decorator';
import { PermissionsGuard } from '../casl/guard/permissions.guard';
import { CohortActions, CohortSubject } from './actions/cohort.actions';
import { Permission } from '../decorators/permission.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Subject(CohortSubject.NAME)
@Controller('cohorts')
@UseGuards(PermissionsGuard)
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Permission(CohortActions.CREATE_COHORTS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCohortDto: CreateCohortDto) {
    return this.cohortsService.create(createCohortDto);
  }

  @Permission(CohortActions.READ_COHORTS)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.cohortsService.findAll(paginationDto);
  }

  @Permission(CohortActions.READ_ACTIVE_COHORTS)
  @Get('active')
  @HttpCode(HttpStatus.OK)
  findActive() {
    return this.cohortsService.findActive();
  }

  @Permission(CohortActions.READ_ONE_COHORTS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.cohortsService.findOne(id);
  }

  @Permission(CohortActions.UPDATE_COHORTS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCohortDto: UpdateCohortDto
  ) {
    return this.cohortsService.update(id, updateCohortDto);
  }

  @Permission(CohortActions.DELETE_COHORTS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.cohortsService.remove(id);
  }

  @Permission(CohortActions.SOFT_DELETE_COHORTS)
  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.cohortsService.softDelete(id);
  }

  @Permission(CohortActions.RESTORE_COHORTS)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.cohortsService.restore(id);
  }

  @Permission(CohortActions.ACTIVATE_COHORTS)
  @Patch(':cohortId/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('cohortId') cohortId: string) {
    return this.cohortsService.activateCohort(cohortId);
  }
}
