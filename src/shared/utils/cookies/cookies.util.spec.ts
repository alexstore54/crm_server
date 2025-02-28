import { CookiesUtil } from './cookies.util';
import { Request, Response } from 'express';

describe('CookiesUtil', () => {
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

  test('setCookies должен устанавливать cookie', () => {
    CookiesUtil.setCookies(res, 'test_cookie', 'test_value', { httpOnly: true });
    expect(res.cookie).toHaveBeenCalledWith('test_cookie', 'test_value', { httpOnly: true });
  });

  test('setAuthTokens должен устанавливать access_token и refresh_token', () => {
    CookiesUtil.setAuthTokens(res, 'access123', 'refresh123');
    expect(res.cookie).toHaveBeenCalledWith('access_token', 'access123', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh123', expect.any(Object));
  });

  test('clearAuthTokens должен удалять access_token и refresh_token', () => {
    CookiesUtil.clearAuthTokens(res);
    expect(res.clearCookie).toHaveBeenCalledWith('access_token', undefined);
    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', undefined);
  });

  test('getCookies должен возвращать значение cookie', () => {
    req.cookies['test_cookie'] = 'test_value';
    expect(CookiesUtil.getCookies(req, 'test_cookie')).toBe('test_value');
  });

  test('clearCookies должен удалять cookie', () => {
    CookiesUtil.clearCookies(res, 'test_cookie', { path: '/' });
    expect(res.clearCookie).toHaveBeenCalledWith('test_cookie', { path: '/' });
  });

  test('getAccessTokenFromCookiesString должен извлекать access_token', () => {
    const cookies = 'access_token=abc123; refresh_token=xyz789';
    expect(CookiesUtil.getAccessTokenFromCookiesString(cookies)).toBe('abc123');
  });

  test('getAccessTokenFromCookiesString должен возвращать null, если access_token отсутствует', () => {
    const cookies = 'refresh_token=xyz789';
    expect(CookiesUtil.getAccessTokenFromCookiesString(cookies)).toBeNull();
  });
});
