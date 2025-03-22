import { Module } from '@nestjs/common';
import { MediaService } from '@/modules/media/services/media.service';
import { MediaController } from '@/modules/media/controllers/media.controller';
import { FileSystemService } from '@/modules/media/services/file-system.service';

@Module({
  controllers: [MediaController],
  providers: [FileSystemService, MediaService],
  exports: [MediaService]
})
export class MediaModule {}