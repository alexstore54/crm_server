import { Module } from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';

@Module({
  providers: [RoleRepository],
  exports: [RoleRepository],
})
export class RoleModule {}
