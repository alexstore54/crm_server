import { Role } from '@prisma/client';
import { permissionsTableSchema } from '@/shared/schemas';

export const getModeratorSeedRole = (): Role => {
  return {
    name: 'Moderator',
    id: 0,
  };
};

export const getPermissions = (): string[] => {
  return Object.keys(permissionsTableSchema.describe().keys);
};
