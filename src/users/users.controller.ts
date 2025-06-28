import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { UserActions, UserSubject } from './actions/users.action';
import errors from '@/config/errors.config';
import { CreateStudentUserDto } from './dto/create-student-user.dto';
import { CreateNonStudentUserDto } from './dto/create-non-student-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Subject(UserSubject.NAME)
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permission(UserActions.CREATE_NON_STUDENT_USERS)
  @Post('/elevated-users')
  @HttpCode(HttpStatus.CREATED)
  async createNonStudentUser(
    @Request() req,
    @Body() createNonStudentUserDto: CreateNonStudentUserDto
  ) {
    return await this.usersService.createNonStudentUser(
      createNonStudentUserDto
    );
  }
  @Permission(UserActions.CREATE_USERS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Permission(UserActions.CREATE_STUDENT_USERS)
  @Post('/students')
  @HttpCode(HttpStatus.CREATED)
  async createStudentUser(
    @Request() req,
    @Body() createStudentUserDto: CreateStudentUserDto
  ) {
    return await this.usersService.createStudentUser(createStudentUserDto);
  }

  @Permission(UserActions.READ_USERS)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Permission(UserActions.READ_SELF_USERS)
  @Get('/me/profile')
  @HttpCode(HttpStatus.OK)
  async getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Permission(UserActions.READ_ONE_USERS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(errors.notFound('User not found'));
    }
    return await this.usersService.findOne(id);
  }

  @Permission(UserActions.UPDATE_USERS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
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

  @Permission(UserActions.UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN)
  @Post('update-self-password-on-first-login')
  @HttpCode(HttpStatus.OK)
  async updateSelfPasswordOnFirstLogin(
    @Request() req,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string
  ) {
    return this.usersService.updateSelfPasswordOnFirstLogin(
      req.user.id,
      newPassword,
      confirmPassword
    );
  }
}
