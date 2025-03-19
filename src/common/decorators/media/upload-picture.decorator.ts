import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MEDIA_LIMITS, MEDIA_REGEX } from '@/shared/constants/config/media.constant';
import { diskStorage } from 'multer';

export function UploadPicture() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        }),
        limits: {
          fileSize: MEDIA_LIMITS.PICTURE_MAX_FILE_SIZE,
          fieldNameSize: MEDIA_LIMITS.MAX_FILE_NAME_LENGTH,
        },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(MEDIA_REGEX.PICTURES)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
    ),
  );
}