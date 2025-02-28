import { Email } from '@prisma/client';

export const getMockedMainEmail = (): Email => {
  return {
    id: 1,
    customerId: 1,
    email: 'example@mail.com',
    isMain: true,
    createdAt: new Date(),
  };
};

export const getMockedEmail = (): Email => {
  return {
    id: 1,
    customerId: 1,
    email: 'example@mail.com',
    isMain: false,
    createdAt: new Date(),
  };
};
