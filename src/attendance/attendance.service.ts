import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import errors from '@/config/errors.config';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>
  ) {}

  // Record clock in (or create a new attendance record)
  async clockIn(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { userId, date, clockIn, weekType } = createAttendanceDto;
    // Check if an attendance record for the user on the given date already exists.
    let attendance = await this.attendanceRepository.findOne({
      where: { userId, date },
    });
    if (attendance) {
      throw new ConflictException(
        errors.conflictError('Attendance for this date already exists')
      );
    }

    attendance = this.attendanceRepository.create({
      userId,
      date,
      clockIn: clockIn || new Date(),
      weekType,
    });
    return await this.attendanceRepository.save(attendance);
  }

  // Update clock out time
  async clockOut(
    updateAttendanceDto: UpdateAttendanceDto
  ): Promise<Attendance> {
    const { attendanceId } = updateAttendanceDto;
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });
    if (!attendance) {
      throw new NotFoundException(
        errors.notFound('Attendance record not found')
      );
    }
    attendance.clockOut = new Date();
    return await this.attendanceRepository.save(attendance);
  }

  // Retrieve all attendance records for a specific user.
  async getAttendanceByUser(userId: string): Promise<Attendance[]> {
    return await this.attendanceRepository.find({ where: { userId } });
  }

  // Retrieve all attendance records (for all users).
  async getAllAttendance(): Promise<Attendance[]> {
    return await this.attendanceRepository.find();
  }
}
