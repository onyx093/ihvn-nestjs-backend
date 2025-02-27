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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { UserActions, UserSubject } from './actions/users.action';

@Subject(UserSubject.NAME)
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permission(UserActions.CREATE_USERS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permission(UserActions.READ_USERS)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Permission(UserActions.READ_ONE_USERS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permission(UserActions.READ_SELF_USERS)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permission(UserActions.UPDATE_USERS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permission(UserActions.DELETE_USERS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Permission(UserActions.ASSIGN_ROLES_TO_USERS)
  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  async assignRoles(
    @Param('id') id: string,
    @Body('roleIds') roleIds: string[]
  ) {
    return this.usersService.assignRoles(id, roleIds);
  }
}
