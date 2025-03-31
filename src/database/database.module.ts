import 'reflect-metadata';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { UserSetting } from '@/users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URL'),
        autoLoadEntities: false,
        entities: [User, UserSetting, Role, Permission, Course, Event],
        synchronize: configService.getOrThrow('SYNCHRONIZE'),
        migrationsRun: configService.getOrThrow('RUN_MIGRATIONS'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
