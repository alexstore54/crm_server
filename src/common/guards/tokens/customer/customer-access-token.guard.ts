import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

@Injectable()
export class CustomerAccessGuard extends AuthGuard(STRATEGIES_NAMES.CUSTOMER_ACCESS_TOKEN) {}
