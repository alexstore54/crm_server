import { CsrfMiddleware } from './csrf.middleware';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import csrf from 'csrf';
import { configKeys } from '@/shared/schemas/app-config.schema';
import { COOKIES } from 'shared/constants/endpoints';

describe('CsrfMiddleware', () => {
  let csrfMiddleware: CsrfMiddleware;
  let configService: Partial<ConfigService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const csrfSecret = 'test-secret';

  beforeEach(() => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === configKeys.CSRF_SECRET) return csrfSecret;
        return null;
      }),
    };

    csrfMiddleware = new CsrfMiddleware(configService as ConfigService);

    // Override csrfProtection methods for tests
    csrfMiddleware['csrfProtection'] = {
      create: jest.fn().mockReturnValue('generated-token'),
      verify: jest.fn().mockReturnValue(true),
    };

    req = {
      method: 'GET',
      cookies: {},
    };

    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should call next immediately for OPTIONS request', () => {
    req.method = 'OPTIONS';
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('should set a cookie with CSRF token for GET request', () => {
    req.method = 'GET';
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(csrfMiddleware['csrfProtection'].create).toHaveBeenCalledWith(csrfSecret);
    expect(res.cookie).toHaveBeenCalledWith(
      COOKIES.CSRF_TOKEN,
      'generated-token',
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      }
    );
    expect(next).toHaveBeenCalled();
  });

  it('should call next for POST request if the token is valid', () => {
    req.method = 'POST';
    req.cookies = { [COOKIES.CSRF_TOKEN]: 'valid-token' };
    // verify returns true
    (csrfMiddleware['csrfProtection'].verify as jest.Mock).mockReturnValue(true);
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(csrfMiddleware['csrfProtection'].verify).toHaveBeenCalledWith(csrfSecret, 'valid-token');
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 for POST request if the token is missing', () => {
    req.method = 'POST';
    req.cookies = {}; // token is missing
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'CSRF token mismatch' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for PUT request with an invalid token', () => {
    req.method = 'PUT';
    req.cookies = { [COOKIES.CSRF_TOKEN]: 'invalid-token' };
    (csrfMiddleware['csrfProtection'].verify as jest.Mock).mockReturnValue(false);
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(csrfMiddleware['csrfProtection'].verify).toHaveBeenCalledWith(csrfSecret, 'invalid-token');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'CSRF token mismatch' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for DELETE request with an invalid token', () => {
    req.method = 'DELETE';
    req.cookies = { [COOKIES.CSRF_TOKEN]: 'invalid-token' };
    (csrfMiddleware['csrfProtection'].verify as jest.Mock).mockReturnValue(false);
    csrfMiddleware.use(req as Request, res as Response, next);
    expect(csrfMiddleware['csrfProtection'].verify).toHaveBeenCalledWith(csrfSecret, 'invalid-token');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'CSRF token mismatch' });
    expect(next).not.toHaveBeenCalled();
  });
});
