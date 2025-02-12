import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(
  STRATEGIES_NAMES.REFRESH_TOKEN,
) {}
