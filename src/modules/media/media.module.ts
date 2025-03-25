import { Module } from '@nestjs/common';
import { MediaService } from '@/modules/media/services/media.service';
import { MediaController } from '@/modules/media/controllers/media.controller';
import { FileSystemService } from '@/modules/media/services/file-system.service';
import { MediaTrashCleanerService } from '@/modules/media/services/media-trash-cleaner.service';

@Module({
  controllers: [MediaController],
  providers: [FileSystemService, MediaService, MediaTrashCleanerService],
  exports: [MediaService]
})
export class MediaModule {}