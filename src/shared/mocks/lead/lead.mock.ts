import { Lead } from '@prisma/client';
import { getMockedEmail } from '@/shared/mocks/email';

export const getMockedLead = (): Lead => ({
  publicId: 'c8f258f1-77fa-4242-917c-c61853deaeb3',
  id: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  country: 'country',
  defaultEmail: getMockedEmail().email,
  agentId: 1,
  teamId: 1,
  createdAt: new Date(),
  isVerified: true,
  statusId: 1,
  deskId: 1,
});
