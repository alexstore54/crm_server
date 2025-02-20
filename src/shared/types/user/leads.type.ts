import { Phone } from '@prisma/client';

export type CreateLead = {
  firstname: string;
  lastname: string;
  country: string;
  defaultEmail?: string;
  status_id?: number;
};
