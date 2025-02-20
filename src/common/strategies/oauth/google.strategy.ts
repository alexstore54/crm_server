import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { ConfigService } from '@nestjs/config';
import { GOOGLE_STRATEGY_SCOPE } from '@/shared/constants/auth/google.constant';
import { configKeys } from '@/shared/schemas';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, STRATEGIES_NAMES.GOOGLE) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>(configKeys.GOOGLE_CLIENT_ID) as string,
      clientSecret: configService.get<string>(configKeys.GOOGLE_CLIENT_SECRET) as string,
      callbackURL: configService.get<string>(configKeys.GOOGLE_CALLBACK_URL),
      scope: GOOGLE_STRATEGY_SCOPE,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      name: displayName,
    };
    return done(null, user);
  }
}
