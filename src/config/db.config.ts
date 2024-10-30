import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const configService: ConfigService = new ConfigService();

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: configService.getOrThrow('DATABASE_URL'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  entities: [],
  synchronize: configService.get('MODE') === 'DEV' ? true : false,
};
