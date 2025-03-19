import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FileLockerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const forbiddenPathsPattern = /^\/public\/(media|documents)\//;

    if (forbiddenPathsPattern.test(req.path)) {
      throw new ForbiddenException('Access to public/media or public/documents directory is forbidden');
    }
    next();
  }
}