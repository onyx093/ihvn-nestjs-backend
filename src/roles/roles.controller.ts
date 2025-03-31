import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/casl/guard/permissions.guard';
import { RoleActions, RoleSubject } from './actions/roles.action';

@Subject(RoleSubject.NAME)
@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permission(RoleActions.CREATE_ROLES)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Body('permissions') permissions: string[]
  ) {
    let createdRole = await this.rolesService.create(createRoleDto);
    if (permissions.length > 0) {
      createdRole = await this.rolesService.assignPermissions(
        createdRole.id,
        permissions
      );
    }
    return createdRole;
  }

  @Permission(RoleActions.READ_ROLES)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.rolesService.findAll();
  }

  @Permission(RoleActions.READ_ONE_ROLES)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Permission(RoleActions.UPDATE_ROLES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Body('permissions') permissions: string[]
  ) {
    let updatedRole = await this.rolesService.update(id, updateRoleDto);
    if (permissions.length > 0) {
      updatedRole = await this.rolesService.assignPermissions(
        updatedRole.id,
        permissions
      );
    }
    return updatedRole;
  }

  @Permission(RoleActions.DELETE_ROLES)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  // Assign permissions to a role
  @Permission(RoleActions.ASSIGN_PERMISSIONS_TO_ROLES)
  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  assignPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[]
  ) {
    // return this.rolesService.assignPermissions(id, permissionIds);
  }
}
