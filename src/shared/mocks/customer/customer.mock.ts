import { FullCustomer } from '@/shared/types/user';
import { getMockedEmail, getMockedMainEmail } from '@/shared/mocks/email/email.mock';
import { getMockedMainPhone, getMockedPhone } from '@/shared/mocks/phone';

export const getMockedFullCustomer = (): FullCustomer => ({
  country: 'country',
  createdAt: new Date(),
  emails: [getMockedMainEmail(), getMockedEmail()],
  firstname: 'firstname',
  lastname: 'lastname',
  id: 1,
  password: 'password',
  lastTimeOnline: new Date(),
  phones: [getMockedPhone(), getMockedMainPhone()],
  publicId: 'publicId',
});
