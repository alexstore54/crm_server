import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

export class GoogleGuard extends AuthGuard(STRATEGIES_NAMES.GOOGLE) {
  constructor() {
    super();
  }
}
