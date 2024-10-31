import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Comment } from './src/users/entities/comment.entity';
import { UserSetting } from './src/users/entities/user-setting.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  entities: [User, UserSetting, Comment],
  synchronize: configService.getOrThrow('SYNCHRONIZE'),
});
