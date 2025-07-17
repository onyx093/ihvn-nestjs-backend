import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionsExplorerService } from '../services/explorer.service';
import { CASLModule } from '../casl/casl.module';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([Role, Permission]),
    CASLModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsExplorerService],
  exports: [PermissionsService, PermissionsExplorerService],
})
export class PermissionsModule {}
