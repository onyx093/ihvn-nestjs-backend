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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';

@Subject('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permission('create_users')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permission('read_users')
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Permission('read_one_users')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permission('update_users')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permission('delete_users')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Permission('assign_roles_to_user')
  @Post(':id/roles')
  assignRoles(@Param('id') id: string, @Body('roleIds') roleIds: string[]) {
    return this.usersService.assignRoles(id, roleIds);
  }
}
