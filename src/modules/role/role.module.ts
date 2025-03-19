import { forwardRef, Module } from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { RoleController } from './controllers/roles.controller';
import { PermissionModule } from '../permissions/permission.module';
import { RoleService } from './services/role.service';

@Module({
  imports: [forwardRef(() => PermissionModule)],
  controllers: [RoleController],

  providers: [RoleService, RoleRepository],
  exports: [RoleRepository, RoleService]
})
export class RoleModule {}


// @Module({
//   imports: [forwardRef(() => PermissionModule)], // если RoleService использует что-то из PermissionModule
//   controllers: [RoleController],
//   providers: [RoleService, RoleRepository],
//   exports: [RoleService, RoleRepository],
// })
//export class RoleModule {}