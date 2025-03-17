import { CookiesUtil } from './cookies.util';
import { Request, Response } from 'express';
import { COOKIES } from '@/shared/constants/endpoints';

describe(CookiesUtil.name, () => {
  let res: Response;
  let req: Request;

  beforeEach(() => {
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;

    req = {
      cookies: {},
    } as unknown as Request;
  });

  it('should set a cookie', () => {
    CookiesUtil.setCookies(res, 'test_cookie', 'test_value', { httpOnly: true });
    expect(res.cookie).toHaveBeenCalledWith('test_cookie', 'test_value', { httpOnly: true });
  });

  it('should set access_token and refresh_token', () => {
    CookiesUtil.setAuthTokens(res, 'access123', 'refresh123');
    expect(res.cookie).toHaveBeenCalledWith(COOKIES.ACCESS_TOKEN, 'access123', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith(COOKIES.REFRESH_TOKEN, 'refresh123', expect.any(Object));
  });

  it('should clear access_token and refresh_token', () => {
    CookiesUtil.clearAuthTokens(res);
    expect(res.clearCookie).toHaveBeenCalledWith(COOKIES.ACCESS_TOKEN, undefined);
    expect(res.clearCookie).toHaveBeenCalledWith(COOKIES.REFRESH_TOKEN, undefined);
  });

  it('should return the value of a cookie', () => {
    req.cookies['test_cookie'] = 'test_value';
    expect(CookiesUtil.getCookies(req, 'test_cookie')).toBe('test_value');
  });

  it('should clear a cookie', () => {
    CookiesUtil.clearCookies(res, 'test_cookie', { path: '/' });
    expect(res.clearCookie).toHaveBeenCalledWith('test_cookie', { path: '/' });
  });

  it('should extract access_token', () => {
    const cookies = 'access_token=abc123; refresh_token=xyz789';
    expect(CookiesUtil.getAccessTokenFromCookiesString(cookies)).toBe('abc123');
  });

  it('should return null if access_token is missing', () => {
    const cookies = 'refresh_token=xyz789';
    expect(CookiesUtil.getAccessTokenFromCookiesString(cookies)).toBeNull();
  });
});