import { Permission } from '@prisma/client';

export type CreateAgent = {
  publicId: string;
  roleId?: number;
  email: string;
  password: string;
  deskIds?: number[];
};
