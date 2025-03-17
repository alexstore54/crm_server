import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';

export const getMockedAgentAuthPayload = (): AgentAuthPayload => {
  return {
    payloadUUID: 'payloadUUID',
    sub: 'sub',
    teamsPublicId: ['teamsPublicId'],
    desksPublicId: ['desksPublicId'],
  };
};

export const getMockedCustomerAuthPayload = (): CustomerAuthPayload => {
  return  {
    payloadUUID: 'payloadUUID',
    sub: 'sub',
  }
}
