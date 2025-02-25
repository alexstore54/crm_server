import { UserEmail, UserPhone } from '@/shared/types/user';

export interface CreateLeadInputParams {
  firstname: string;
  lastname: string;
  country: string;
  defaultEmail: string;
  agentId?: number;
  statusId: number;
  password: string;
  emails: UserEmail[];
  phones: UserPhone[];
}
