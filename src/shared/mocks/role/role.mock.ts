import { Role } from '@prisma/client';

export const getMockedRole = (): Role => {
  return {
    id: 1,
    name: 'mock_role',
    isMutable: true,
    avatarURL: null,
    publicId: 'publicId',
    isVisible: true,
  };
};
