import { CustomerEmail } from '@/shared/types/user/email.type';
import { FullLead } from '@/shared/types/user/lead.type';

export type FullCustomer = FullLead & {
  customerInfo: CustomerInfo;
}

export type CustomerInfo = {
  id: number;
  password?: string;
  emails: CustomerEmail[]
}