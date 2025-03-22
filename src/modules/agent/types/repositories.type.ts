import { CreateAgent } from '@/modules/agent/dto';
import { Desk } from '@prisma/client';

export interface CreateAgentInput {
  input: CreateAgent;
  desks: Desk[] | null;
  src?: string;
}
