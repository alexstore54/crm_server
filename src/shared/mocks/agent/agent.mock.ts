import { Agent } from '@prisma/client';
import { getMockedEmail } from '@/shared/mocks/email/email.mock';
import { AgentForClient } from '@/shared/types/agent';

export const getMockedAgent = (): Agent => {
  return {
    id: 1,
    email: getMockedEmail().email,
    roleId: 1,
    password: 'password',
    publicId: 'publicId',
    lastOnline: new Date(),
  };
};

export const getMockedAgentForClient = (): AgentForClient => {
  return {
    id: 1,
    email: getMockedEmail().email,
    roleId: 1,
    publicId: 'publicId',
    lastOnline: new Date(),
  }
}