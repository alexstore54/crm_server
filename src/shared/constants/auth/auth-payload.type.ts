import { Roles } from '@prisma/client';

export interface AuthPayload {
  role: Roles;
  email: string;
  sub: string;
}
