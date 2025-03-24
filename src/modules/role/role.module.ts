import { forwardRef, Module } from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { RoleController } from './controllers/roles.controller';
import { PermissionModule } from '../permissions/permission.module';
import { RoleService } from './services/role.service';
import { MediaModule } from '@/modules/media';
import { MediaService } from '@/modules/media/services/media.service';

@Module({
  imports: [forwardRef(() => PermissionModule), MediaModule],
  controllers: [RoleController],

  providers: [RoleService, RoleRepository, MediaService],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
