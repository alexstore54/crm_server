import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

export class CustomerRefreshGuard extends AuthGuard(STRATEGIES_NAMES.CUSTOMER_REFRESH_TOKEN) {}
