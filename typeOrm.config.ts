import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserSetting } from './src/users/entities/user-setting.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from './src/roles/entities/role.entity';
import { Permission } from './src/permissions/entities/permission.entity';
import { Course } from './src/courses/entities/course.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),

  entities: [User, UserSetting, Role, Permission, Course],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
});
