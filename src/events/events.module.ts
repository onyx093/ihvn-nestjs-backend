import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CASLModule } from '@/casl/casl.module';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CASLModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
