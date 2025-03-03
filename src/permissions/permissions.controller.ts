import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import {
  PermissionActions,
  PermissionSubject,
} from './actions/permissions.action';

@Subject(PermissionSubject.NAME)
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permission(PermissionActions.CREATE_PERMISSIONS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Permission(PermissionActions.READ_PERMISSIONS)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Permission(PermissionActions.READ_ONE_PERMISSIONS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Permission(PermissionActions.UPDATE_PERMISSIONS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Permission(PermissionActions.DELETE_PERMISSIONS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
