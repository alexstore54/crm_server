import { UserEmail } from '@/shared/types/user/email.type';
import { UserPhone } from '@/shared/types/user/phone.type';

export type FullCustomer = {
  id: number;
  publicId: string;
  firstname: string;
  lastname: string;
  country?: string;
  password?: string;
  emails: UserEmail[];
  phones: UserPhone[];
  lastTimeOnline?: Date;
  createdAt?: Date;
};
