import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Subject } from '@/decorators/subject.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { EventActions, EventSubject } from './actions/events.action';
import { Permission } from '@/decorators/permission.decorator';

@Subject(EventSubject.NAME)
@Controller('events')
@UseGuards(PermissionsGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Permission(EventActions.CREATE_EVENTS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Permission(EventActions.READ_EVENTS)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.eventsService.findAll();
  }

  @Permission(EventActions.READ_ONE_EVENTS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Permission(EventActions.UPDATE_EVENTS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Permission(EventActions.DELETE_EVENTS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
