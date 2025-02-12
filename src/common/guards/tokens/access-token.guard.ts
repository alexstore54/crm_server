import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

@Injectable()
export class AccessTokenGuard extends AuthGuard(
  STRATEGIES_NAMES.ACCESS_TOKEN,
) {}
