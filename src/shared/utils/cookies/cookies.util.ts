import { Request, Response } from 'express';
import { COOKIES } from '@/shared/constants/response';
import { NodeEnv } from '@/common/config/types';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

export class CookiesUtil {
  private static readonly isProduction = process.env['NODE_ENV'] === NodeEnv.production;

  public static setCookies(res: Response, name: string, value: string, options?: any): void {
    res.cookie(name, value, options);
  }

  public static setAuthTokens(res: Response, accessToken: string, refreshToken: string) {
    this.setCookies(res, COOKIES.ACCESS_TOKEN, accessToken, {
      httpOnly: this.isProduction,
      secure: this.isProduction,
    });
    this.setCookies(res, COOKIES.REFRESH_TOKEN, refreshToken, {
      httpOnly: this.isProduction,
      secure: this.isProduction,
    });
  }

  public static clearAuthTokens(res: Response) {
    this.clearCookies(res, COOKIES.ACCESS_TOKEN);
    this.clearCookies(res, COOKIES.REFRESH_TOKEN);
  }

  public static getCookies(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }

  public static clearCookies(res: Response, name: string, options?: any): void {
    res.clearCookie(name, options);
  }

  public static getAccessTokenFromCookiesString(cookies: string): string | null {
    const accessToken = cookies
      .split('; ')
      .find((row) => row.startsWith(`${COOKIES.ACCESS_TOKEN}=`))
      ?.split('=')[1];

    return accessToken || null;
  }
}
