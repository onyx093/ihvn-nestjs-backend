import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Subject } from '../decorators/subject.decorator';
import { LessonActions, LessonSubject } from './actions/lesson.actions';
import { PermissionsGuard } from '../casl/guard/permissions.guard';
import { Permission } from '../decorators/permission.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserInfo } from '../common/interfaces/current-user-info.interface';

@Subject(LessonSubject.NAME)
@Controller('lessons')
@UseGuards(PermissionsGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Permission(LessonActions.GENERATE_LESSONS_FOR_ACTIVE_COHORT)
  @Post('cohorts/:cohortId/generate')
  @HttpCode(HttpStatus.CREATED)
  async generateLessonsForActiveCohort(@Param('cohortId') cohortId: string) {
    return this.lessonService.generateLessonsForActiveCohort(cohortId);
  }

  @Permission(LessonActions.GENERATE_LESSONS_FOR_COURSE_IN_COHORT)
  @Post('course/:courseId/generate')
  @HttpCode(HttpStatus.CREATED)
  async generateForSpecific(
    @Param('cohortId') cohortId: string,
    @Param('courseId') courseId: string
  ) {
    return this.lessonService.generateLessonsForCourseInCohort(
      courseId,
      cohortId
    );
  }

  @Permission(LessonActions.LIST_STUDENTS_ATTENDANCE_IN_LESSON)
  @Get(':lessonId/students')
  @HttpCode(HttpStatus.OK)
  async getStudentAttendanceInLesson(@Param('lessonId') lessonId: string) {
    return this.lessonService.getStudentAttendanceInLesson(lessonId);
  }

  @Permission(LessonActions.READ_LESSONS)
  @Get('cohorts/:cohortId')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('cohortId') cohortId: string,
    @CurrentUser() user: CurrentUserInfo
  ) {
    return this.lessonService.getCohortLessons(cohortId, user);
  }

  @Permission(LessonActions.READ_ONE_LESSONS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.lessonService.findOne(id, user);
  }

  @Permission(LessonActions.MARK_LESSON_AS_COMPLETED)
  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  async markAsCompleted(@Param('id') lessonId: string) {
    return this.lessonService.markAsCompleted(lessonId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}

// rt
