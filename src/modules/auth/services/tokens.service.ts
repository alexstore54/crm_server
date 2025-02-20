import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokens } from '@/shared/types/auth';
import { configKeys } from '@/shared/schemas';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async getTokens(...args: unknown[]): Promise<AuthTokens> {
    const payload = { ...args };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: this.configService.get(configKeys.ACCESS_TOKEN_EXPIRES_IN),
        },
      ),
      this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: this.configService.get(configKeys.REFRESH_TOKEN_EXPIRES_IN),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
