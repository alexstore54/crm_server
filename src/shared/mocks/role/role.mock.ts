import { Role } from '@prisma/client';

export const getMockedRole = (): Role => {
  return  {
    id: 1,
    name: 'moderator',
  }
}