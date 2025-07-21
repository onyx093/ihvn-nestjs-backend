import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { Connection } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const loggerInstance = app.get(Logger);
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const configService = app.get(ConfigService);
  // Optionally seed the database on startup (for development)
  if (configService.get('SEED_DB') === 'true') {
    const connection = app.get(Connection);
    console.log('Seeding database...');
    // await runSeeders();
    // You can uncomment the line below to run seeders
  }
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
