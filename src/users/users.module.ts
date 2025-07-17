import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSetting } from './entities/user-setting.entity';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '../queues/email.module';
import { ConfigService } from '@nestjs/config';
import { Role } from '../roles/entities/role.entity';
import { CASLModule } from '../casl/casl.module';
import { DiscoveryModule } from '@nestjs/core';
import { Account } from './entities/account.entity';
import { Cohort } from '../cohorts/entities/cohort.entity';
import { StudentsModule } from '../students/students.module';

const configService = new ConfigService();

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([User, UserSetting, Role, Account, Cohort]),
    BullModule.registerQueue({
      name: 'email',
      redis: {
        host: configService.getOrThrow('REDIS_HOST'),
        port: configService.getOrThrow('REDIS_PORT'),
      },
    }),
    EmailModule,
    StudentsModule,
    CASLModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
