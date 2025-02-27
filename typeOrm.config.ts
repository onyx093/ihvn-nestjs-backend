import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserSetting } from './src/users/entities/user-setting.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from './src/roles/entities/role.entity';
import { Permission } from './src/permissions/entities/permission.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.getOrThrow('DATASOURCE_URL'),
  entities: [User, UserSetting, Role, Permission],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
});
