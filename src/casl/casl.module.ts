import { Module } from '@nestjs/common';
import { PermissionsGuard } from './guard/permissions.guard';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [],
  controllers: [],
  providers: [CaslAbilityFactory, PermissionsGuard],
  exports: [CaslAbilityFactory],
})
export class CASLModule {}
