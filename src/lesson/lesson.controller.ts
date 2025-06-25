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
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Subject } from '@/decorators/subject.decorator';
import { LessonActions, LessonSubject } from './actions/lesson.actions';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Subject(LessonSubject.NAME)
@Controller('cohorts/:cohortId/lessons')
@UseGuards(PermissionsGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Permission(LessonActions.GENERATE_LESSONS_FOR_ACTIVE_COHORT)
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generateLessonsForActiveCohort(@Param('cohortId') cohortId: string) {
    return this.lessonService.generateLessonsForActiveCohort(cohortId);
  }

  @Permission(LessonActions.GENERATE_LESSONS_FOR_COURSE_IN_COHORT)
  @Post('generate/:cohortId/:courseId')
  @HttpCode(HttpStatus.CREATED)
  generateForSpecific(
    @Param('cohortId') cohortId: string,
    @Param('courseId') courseId: string
  ) {
    return this.lessonService.generateLessonsForCourseInCohort(
      courseId,
      cohortId
    );
  }

  @Permission(LessonActions.READ_LESSONS)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('cohortId') cohortId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.lessonService.getCohortLessons(cohortId, paginationDto);
  }

  @Permission(LessonActions.READ_ONE_LESSONS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Permission(LessonActions.MARK_LESSON_AS_COMPLETED)
  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  markAsCompleted(@Param('id') lessonId: string) {
    return this.lessonService.markAsCompleted(lessonId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}

// rt
