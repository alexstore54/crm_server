import { Lead } from '@prisma/client';
import { getMockedEmail } from '@/shared/mocks/email';

export const getMockedLead = (): Lead => ({
  id: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  publicId: 'publicId',
  country: 'country',
  defaultEmail: getMockedEmail().email,
  agentId: 1,
  teamId: 1,
  createdAt: new Date(),
  isVerified: true,
  statusId: 1,
  deskId: 1,
});
