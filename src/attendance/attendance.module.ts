import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([Attendance]),
    CASLModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
