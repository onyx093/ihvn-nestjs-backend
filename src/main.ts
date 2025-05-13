import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { Connection } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as mkdirp from 'mkdirp';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const loggerInstance = app.get(Logger);
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  mkdirp.sync(join(__dirname, '..', 'uploads', 'thumbnails'));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/thumbnails',
  });

  const configService = app.get(ConfigService);
  // Optionally seed the database on startup (for development)
  if (configService.get('SEED_DB') === 'true') {
    const connection = app.get(Connection);
    console.log('Seeding database...');
    // await runSeeders();
  }
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
