import { forwardRef, Module } from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { RoleController } from './controllers/roles.controller';
import { PermissionModule } from '../permissions/permission.module';
import { RoleService } from './services/role.service';
import { MediaModule } from '@/modules/media';
import { MediaImagesService } from '@/modules/media/services/media-images.service';

@Module({
  imports: [forwardRef(() => PermissionModule), MediaModule],
  controllers: [RoleController],

  providers: [RoleService, RoleRepository, MediaImagesService],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
