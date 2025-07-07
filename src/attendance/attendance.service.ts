import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import errors from '@/config/errors.config';
import { Student } from '../students/entities/student.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { AttendanceStatus } from '@/enums/attendance.enum';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { ConfirmAttendanceDto } from './dto/confirm-attendance.dto';
import { InstructorsService } from '@/instructors/instructors.service';
import { Course } from '@/courses/entities/course.entity';
import { CohortsService } from '@/cohorts/cohorts.service';
import { CurrentUserInfo } from '@/common/interfaces/current-user-info.interface';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';
import { endOfDay, startOfDay } from 'date-fns';
import { GetAttendanceListDto } from './dto/get-attendance-list.dto';
import { LessonWithAttendanceCounts } from '@/types/lesson.type';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private readonly instructorService: InstructorsService,
    private readonly cohortService: CohortsService
  ) {}

  async markAttendance(
    userId: string,
    markAttendanceDto: MarkAttendanceDto
  ): Promise<Attendance> {
    const {
      lessonId,
      status = AttendanceStatus.PRESENT,
      notes,
    } = markAttendanceDto;

    // Verify lesson exists
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: {
        course: true,
        cohort: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(errors.notFound('Lesson not found'));
    }

    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!student) {
      throw new NotFoundException(errors.notFound('Student not found'));
    }

    // Verify student is enrolled in the course
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: student.id },
        cohortCourse: {
          course: { id: lesson.course.id },
          cohort: { id: lesson.cohort.id },
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        errors.forbiddenAccess('Student is not enrolled in this course')
      );
    }

    // Check if attendance already exists
    let attendance = await this.attendanceRepository.findOne({
      where: {
        student: { id: student.id },
        lesson: { id: lessonId },
      },
    });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.studentMarkedAt = new Date();
      attendance.notes = notes;
      attendance.instructorConfirmed = false; // Reset confirmation when student updates
      attendance.confirmedBy = null;
      attendance.confirmedAt = null;
    } else {
      // Create new attendance record

      attendance = this.attendanceRepository.create({
        student,
        lesson,
        status,
        studentMarkedAt: new Date(),
        notes,
        instructorConfirmed: false,
      });
    }

    return this.attendanceRepository.save(attendance);
  }

  // Instructor confirms student attendance
  async confirmAttendance(
    instructorId: string,
    confirmAttendanceDto: ConfirmAttendanceDto
  ): Promise<Attendance> {
    const { attendanceId, status, notes } = confirmAttendanceDto;

    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: ['lesson', 'lesson.course', 'student'],
    });

    if (!attendance) {
      throw new NotFoundException(
        errors.notFound('Attendance record not found')
      );
    }

    // Verify instructor teaches this course
    const course = await this.courseRepository.findOne({
      where: {
        id: attendance.lesson.course.id,
        instructor: { id: instructorId },
      },
    });

    if (!course) {
      throw new ForbiddenException(
        errors.forbiddenAccess(
          'You are not authorized to confirm attendance for this course'
        )
      );
    }

    const instructor = await this.instructorService.findOne(instructorId);

    attendance.status = status;
    attendance.instructorConfirmed = true;
    attendance.confirmedBy = instructor;
    attendance.confirmedAt = new Date();
    if (notes) attendance.notes = notes;

    return this.attendanceRepository.save(attendance);
  }

  // Get attendance list for a lesson
  async getLessonAttendanceDetails(lessonId: string): Promise<any[]> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(errors.notFound('Lesson not found'));
    }
    // Get all enrolled students for the course
    const enrollments = await this.enrollmentRepository.find({
      where: {
        cohortCourse: {
          course: { id: lesson.course.id },
          cohort: { id: lesson.cohort.id },
        },
      },
      relations: { student: { user: true } },
    });

    // Get attendance for specific lesson
    const attendances = await this.attendanceRepository.find({
      where: {
        lesson: { id: lessonId },
        instructorConfirmed: true,
      },
      relations: {
        student: { user: true },
        lesson: { course: true, cohort: true },
      },
      order: { createdAt: 'DESC' },
    });

    // Create map of student attendance
    const attendanceMap = new Map();
    attendances.forEach((att) => {
      attendanceMap.set(att.student.id, att);
    });

    // Return list with all enrolled students and their attendance status
    return enrollments.map((enrollment) => {
      const attendance = attendanceMap.get(enrollment.student.id);
      return {
        student: {
          id: enrollment.student.id,
          name: enrollment.student.user.name,
          email: enrollment.student.user.email,
        },
        attendance: attendance
          ? {
              id: attendance.id,
              status: attendance.status,
              studentMarkedAt: attendance.studentMarkedAt,
              instructorConfirmed: attendance.instructorConfirmed,
              confirmedBy: attendance.confirmedBy,
              confirmedAt: attendance.confirmedAt,
              notes: attendance.notes,
            }
          : null,
        hasMarkedAttendance: !!attendance,
      };
    });
  }

  async getAttendanceListByLessons(
    getAttendanceListDto: GetAttendanceListDto,
    paginationDto: PaginationDto
  ): Promise<PaginationResult<LessonWithAttendanceCounts>> {
    const { courseId, dateRange } = getAttendanceListDto;

    const start = dateRange?.startDate
      ? startOfDay(new Date(dateRange.startDate))
      : startOfDay(new Date());
    const end = dateRange?.endDate
      ? endOfDay(new Date(dateRange.endDate))
      : endOfDay(new Date());

    const where: FindOptionsWhere<Lesson> = {
      ...(courseId && { course: { id: courseId } }),
      attendances: {
        createdAt: Between(start, end),
      },
    };

    const { page, limit } = paginationDto;
    const [data, total] = await this.lessonRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        attendances: { student: { user: true } },
        course: true,
        cohort: true,
      },
      where,
      order: {
        attendances: {
          createdAt: 'DESC',
        },
      },
    });

    const lessonsWithCounts = data.map((lesson) => {
      let presentCount = 0;
      let absentCount = 0;

      for (const attendance of lesson.attendances || []) {
        if (attendance.status === AttendanceStatus.PRESENT) {
          presentCount++;
        } else if (attendance.status === AttendanceStatus.ABSENT) {
          absentCount++;
        }
      }

      return {
        ...lesson,
        presentCount,
        absentCount,
      };
    });

    return {
      data: lessonsWithCounts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get student's own attendance history
  async getStudentAttendance(
    user: CurrentUserInfo,
    cohortId: string,
    courseId: string,
    studentId: string = null
  ): Promise<Attendance[]> {
    const student = studentId
      ? await this.studentRepository.findOneBy({ id: studentId })
      : await this.studentRepository.findOne({
          where: {
            user: { id: user.id },
          },
        });

    if (!student) {
      throw new NotFoundException(errors.notFound('Student not found'));
    }

    const enrollment = await this.enrollmentRepository.find({
      where: {
        student: { id: student.id },
        cohortCourse: { cohort: { id: cohortId }, course: { id: courseId } },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        errors.forbiddenAccess("This student didn't enroll for this course")
      );
    }
    const activeCohort = cohortId
      ? await this.cohortService.findOne(cohortId)
      : await this.cohortService.findActive();
    if (!activeCohort) {
      throw new NotFoundException(errors.notFound('Cohort not found'));
    }
    return this.attendanceRepository.find({
      where: {
        student: { id: studentId },
        lesson: {
          course: { id: courseId },
          cohort: { id: cohortId },
        },
      },
      relations: { lesson: true },
      order: { createdAt: 'DESC', lesson: { course: 'ASC' } },
    });
  }

  // Admin/Instructor: Create attendance record
  async createAttendance(
    createAttendanceDto: CreateAttendanceDto
  ): Promise<Attendance> {
    const {
      studentId,
      lessonId,
      status = AttendanceStatus.ABSENT,
      notes,
    } = createAttendanceDto;

    // Verify entities exist
    const [student, lesson] = await Promise.all([
      this.studentRepository.findOne({ where: { id: studentId } }),
      this.lessonRepository.findOne({ where: { id: lessonId } }),
    ]);

    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if attendance already exists
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student: { id: studentId },
        lesson: { id: lessonId },
      },
    });

    if (existingAttendance) {
      throw new BadRequestException(
        errors.badRequest(
          'Attendance record already exists for this student and lesson'
        )
      );
    }

    const attendance = this.attendanceRepository.create({
      student,
      lesson,
      status,
      notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  // Update attendance record
  async updateAttendance(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    Object.assign(attendance, updateAttendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  // Delete attendance record
  async deleteAttendance(id: string): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Attendance record not found');
    }
  }

  // Get attendance statistics for a course
  async getAttendanceStats(cohortId: string, courseId: string): Promise<any> {
    const stats = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN attendance.status = :pending THEN 1 ELSE 0 END) as pending',
        'SUM(CASE WHEN attendance.status = :present THEN 1 ELSE 0 END) as present',
        'SUM(CASE WHEN attendance.status = :absent THEN 1 ELSE 0 END) as absent',
        'SUM(CASE WHEN attendance.status = :late THEN 1 ELSE 0 END) as late',
        'SUM(CASE WHEN attendance.status = :excused THEN 1 ELSE 0 END) as excused',
        'SUM(CASE WHEN attendance.instructorConfirmed = true THEN 1 ELSE 0 END) as confirmed',
      ])
      .where('attendance.course.id = :courseId', { courseId })
      .setParameters({
        pending: AttendanceStatus.PENDING,
        present: AttendanceStatus.PRESENT,
        absent: AttendanceStatus.ABSENT,
        late: AttendanceStatus.LATE,
        excused: AttendanceStatus.EXCUSED,
      })
      .getRawOne();

    return {
      total: parseInt(stats.total),
      present: parseInt(stats.present),
      absent: parseInt(stats.absent),
      late: parseInt(stats.late),
      excused: parseInt(stats.excused),
      confirmed: parseInt(stats.confirmed),
      attendanceRate:
        stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0,
    };
  }
}
