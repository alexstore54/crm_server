import { UserEmail, UserPhone } from '@/shared/types/user';

// export interface CreateLeadInput {
//   firstname: string;
//   lastname: string;
//   country?: string;
//   defaultEmail?: string;
//   agentId?: number;
//   statusId?: number;
//   password: string;
//   emails: UserEmail[];
//   phones: UserPhone[];
// }
 

export interface CreateLeadInput {
  firstname: string;
  lastname: string;
  country?: string;
  email: string;
  agentId?: number;
  statusId?: number;
  phone: string;
}