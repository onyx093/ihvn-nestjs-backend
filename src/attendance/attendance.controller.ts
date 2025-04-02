import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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

@Subject(AttendanceSubject.NAME)
@Controller('attendance')
@UseGuards(PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Endpoint to record clock in.
  @Permission(AttendanceActions.CLOCK_IN)
  @Post('clock-in')
  @HttpCode(HttpStatus.CREATED)
  async clockIn(
    @Body() createAttendanceDto: CreateAttendanceDto
  ): Promise<Attendance> {
    return await this.attendanceService.clockIn(createAttendanceDto);
  }

  // Endpoint to record clock out.
  @Permission(AttendanceActions.CLOCK_OUT)
  @Patch('clock-out')
  @HttpCode(HttpStatus.OK)
  async clockOut(
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ): Promise<Attendance> {
    return await this.attendanceService.clockOut(updateAttendanceDto);
  }

  // Get attendance records for a specific user.
  @Permission(AttendanceActions.GET_USER_ATTENDANCE)
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserAttendance(
    @Param('userId') userId: string
  ): Promise<Attendance[]> {
    return await this.attendanceService.getAttendanceByUser(userId);
  }

  // Get attendance records for all users.
  @Permission(AttendanceActions.GET_ALL_ATTENDANCE)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAttendance(): Promise<Attendance[]> {
    return await this.attendanceService.getAllAttendance();
  }
}
