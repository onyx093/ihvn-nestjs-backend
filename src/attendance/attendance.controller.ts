import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  AttendanceActions,
  AttendanceSubject,
} from './actions/attendance.action';
import { Subject } from '@/decorators/subject.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { Permission } from '@/decorators/permission.decorator';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CurrentUserInfo } from '@/common/interfaces/current-user-info.interface';
import { ConfirmAttendanceDto } from './dto/confirm-attendance.dto';
import { get } from 'http';
import { GetAttendanceListDto } from './dto/get-attendance-list.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Subject(AttendanceSubject.NAME)
@Controller('attendance')
@UseGuards(PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Endpoint to mark attendance as a student.
  @Permission(AttendanceActions.MARK_ATTENDANCE)
  @Post('mark-attendance')
  @HttpCode(HttpStatus.CREATED)
  async markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto,
    @CurrentUser() user: CurrentUserInfo
  ): Promise<Attendance> {
    return await this.attendanceService.markAttendance(user, markAttendanceDto);
  }

  // Endpoint to mark attendance as a student.
  @Permission(AttendanceActions.CONFIRM_ATTENDANCE)
  @Post('confirm-attendance')
  @HttpCode(HttpStatus.CREATED)
  async confirmAttendance(
    @Body() confirmAttendanceDto: ConfirmAttendanceDto,
    @CurrentUser() user: CurrentUserInfo
  ): Promise<Attendance> {
    return await this.attendanceService.confirmAttendance(
      user,
      confirmAttendanceDto
    );
  }

  // Endpoint to create attendance as an admin or instructor.
  @Permission(AttendanceActions.CREATE_ATTENDANCE)
  @Post('create-attendance')
  @HttpCode(HttpStatus.CREATED)
  async createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @CurrentUser() user: CurrentUserInfo
  ): Promise<Attendance> {
    return await this.attendanceService.createAttendance(
      createAttendanceDto,
      user
    );
  }

  // Get attendance records for a specific user.
  @Permission(AttendanceActions.GET_USER_ATTENDANCE)
  @Get('cohort/:cohortId/course/:courseId/student/:studentId')
  @HttpCode(HttpStatus.OK)
  async getStudentAttendance(
    @Param('cohortId') cohortId: string,
    @Param('courseId') courseId: string,
    @CurrentUser() user: CurrentUserInfo,
    @Param('studentId') studentId: string
  ): Promise<Attendance[]> {
    return await this.attendanceService.getStudentAttendance(
      user,
      cohortId,
      courseId,
      studentId
    );
  }

  // Get student attendance records for a lesson.
  @Permission(AttendanceActions.GET_ATTENDANCE_LIST_BY_LESSONS)
  @Get('get-attendance-by-lessons')
  @HttpCode(HttpStatus.OK)
  async getAttendanceListByLessons(
    @Query() getAttendanceListDto: GetAttendanceListDto,
    @Query() paginationDto: PaginationDto
  ) {
    return await this.attendanceService.getAttendanceListByLessons(
      getAttendanceListDto,
      paginationDto
    );
  }

  // Get student attendance records for a lesson.
  @Permission(AttendanceActions.GET_LESSON_ATTENDANCE_DETAILS)
  @Get('get-lesson-attendance-details/:lessonId')
  @HttpCode(HttpStatus.OK)
  async getLessonAttendanceListDetails(@Param('lessonId') lessonId: string) {
    return await this.attendanceService.getLessonAttendanceDetails(lessonId);
  }
}
