import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

@Injectable()
export class AgentAccessTokenGuard extends AuthGuard(STRATEGIES_NAMES.AGENT_ACCESS_TOKEN) {}
