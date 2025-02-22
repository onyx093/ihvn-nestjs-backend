import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionsExplorerService } from '@/services/explorer.service';

@Module({
  imports: [DiscoveryModule, TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsExplorerService],
  exports: [PermissionsService, PermissionsExplorerService],
})
export class PermissionsModule {}
