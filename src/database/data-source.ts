import { Role } from '../roles/entities/role.entity';
import { UserSetting } from '../users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { SeederOptions } from 'typeorm-extension';
import { Course } from '../courses/entities/course.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Account } from '../users/entities/account.entity';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),

  seeds: ['src/database/seeders/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
  entities: [User, UserSetting, Role, Permission, Course, Attendance, Account],
};

export const dataSource = new DataSource(options);
