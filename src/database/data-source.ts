import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  synchronize: process.env.SYNCHRONIZE === 'false',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: process.env.RUN_MIGRATIONS === 'true',
  logging: true,
});
