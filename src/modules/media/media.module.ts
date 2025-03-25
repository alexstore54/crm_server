import { Module } from '@nestjs/common';
import { MediaImagesService } from '@/modules/media/services/media-images.service';
import { MediaController } from '@/modules/media/controllers/media.controller';
import { FileSystemService } from '@/modules/media/services/file-system.service';
import { MediaTrashCleanerService } from '@/modules/media/services/media-trash-cleaner.service';

@Module({
  controllers: [MediaController],
  providers: [FileSystemService, MediaImagesService, MediaTrashCleanerService],
  exports: [MediaImagesService]
})
export class MediaModule {}