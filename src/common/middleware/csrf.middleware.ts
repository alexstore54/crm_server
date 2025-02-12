import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import csrf from 'csrf';
import { configKeys } from '@/common/config/app-config.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection: any;

  constructor(private configService: ConfigService) {
    this.csrfProtection = new csrf();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const csrfSecret = this.configService.get<string>(configKeys.CSRF_SECRET);

    if (req.method === 'OPTIONS') {
      return next();
    }

    if (req.method === 'GET') {
      const token = this.csrfProtection.create(csrfSecret);
      res.cookie('XSRF-TOKEN', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      });
    } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const csrfToken = req.cookies['XSRF-TOKEN'];
      if (!csrfToken || !this.csrfProtection.verify(csrfSecret, csrfToken)) {
        return res.status(403).json({ message: 'CSRF token mismatch' });
      }
    }
    return next();
  }
}