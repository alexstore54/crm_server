// src/common/decorators/media/upload-document.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MEDIA_LIMITS, MEDIA_REGEX } from '@/shared/constants/config';

export function UploadDocument() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        }),
        limits: {
          fileSize: MEDIA_LIMITS.DOCUMENT_MAX_FILE_SIZE,
        },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(MEDIA_REGEX.DOCUMENTS)) {
            return cb(new Error('Only document files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
    ),
  );
}
