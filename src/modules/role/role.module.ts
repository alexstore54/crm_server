import { Module } from '@nestjs/common';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { MediaModule } from '@/modules/media';
import { MediaService } from '@/modules/media/services/media.service';

@Module({
  imports: [MediaModule],
  providers: [RoleRepository, MediaService],
  exports: [RoleRepository],
})
export class RoleModule {}
