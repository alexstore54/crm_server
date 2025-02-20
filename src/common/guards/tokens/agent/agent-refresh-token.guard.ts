import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentRefreshGuard extends AuthGuard(STRATEGIES_NAMES.AGENT_REFRESH_TOKEN) {}
