import { Request, Response } from 'express';

export class CookiesUtil {
  public static setCookies(
    res: Response,
    name: string,
    value: string,
    options?: any,
  ): void {
    res.cookie(name, value, options);
  }

  public static setAuthTokens(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setCookies(res, 'access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    this.setCookies(res, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  public static clearAuthTokens(res: Response) {
    this.clearCookies(res, 'access_token');
    this.clearCookies(res, 'refresh_token');
  }

  public static getCookies(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }

  public static clearCookies(res: Response, name: string, options?: any): void {
    res.clearCookie(name, options);
  }
}
