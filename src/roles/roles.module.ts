import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '@/permissions/entities/permission.entity';
import { CASLModule } from '@/casl/casl.module';
import { PermissionsExplorerService } from '@/services/explorer.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([Role, Permission]),
    CASLModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, PermissionsExplorerService],
  exports: [RolesService, PermissionsExplorerService],
})
export class RolesModule {}
