import { FullCustomer } from '@/shared/types/user';
import { getMockedEmail, getMockedMainEmail } from '@/shared/mocks/email/email.mock';
import { getMockedMainPhone, getMockedPhone } from '@/shared/mocks/phone';
import { Customer } from '@prisma/client';
import { getMockedLead } from '@/shared/mocks/lead';

export const getMockedFullCustomer = (): FullCustomer => ({
  country: getMockedLead().country as string,
  emails: [getMockedMainEmail(), getMockedEmail()],
  firstname: getMockedLead().firstname as string,
  lastname: getMockedLead().lastname as string,
  id: getMockedLead().id as number,
  password: getMockedCustomer().password as string,
  phones: [getMockedPhone(), getMockedMainPhone()],
  publicId: getMockedCustomer().publicId as string,
});

export const getMockedCustomer = (): Customer => ({
  id: getMockedLead().id as number,
  password: 'password',
  avatarURL: null,
  leadId: getMockedLead().id as number,
  publicId: getMockedLead().publicId,
  lastOnline: new Date(),
});