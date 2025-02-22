import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Subject } from '@/decorators/subject.decorator';
import { Permission } from '@/decorators/permission.decorator';

@Subject('Role')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permission('create_roles')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Permission('read_roles')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Permission('read_one_roles')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Permission('update_roles')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Permission('delete_roles')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  // Assign permissions to a role
  @Permission('assign_permissions_to_role')
  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[]
  ) {
    // return this.rolesService.assignPermissions(id, permissionIds);
  }
}
