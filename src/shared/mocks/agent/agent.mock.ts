import { Agent } from '@prisma/client';
import { getMockedEmail } from '@/shared/mocks/email/email.mock';

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