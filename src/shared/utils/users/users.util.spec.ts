import { UsersUtil } from './users.util';
import { Customer, Email, Lead, Phone } from '@prisma/client';
import { FullCustomer, UserEmail, UserPhone } from '@/shared/types/user';
import { getMockedCustomer, getMockedFullCustomer } from '@/shared/mocks/customer';
import { getMockedLead } from '@/shared/mocks/lead';
import { getMockedMainPhone, getMockedPhone } from '@/shared/mocks/phone';
import { getMockedEmail, getMockedMainEmail } from '@/shared/mocks/email';

describe(UsersUtil.name, () => {
  describe(UsersUtil.mapCustomerToFullCustomer.name, () => {
    it('should map customer, lead, phones, and emails to FullCustomer', () => {
      const customer: Customer = getMockedCustomer();
      const lead: Lead = getMockedLead();
      const phones: Phone[] = [getMockedPhone(), getMockedMainPhone()];
      const emails: Email[] = [getMockedEmail(), getMockedMainEmail()];

      const result: FullCustomer = UsersUtil.mapCustomerToFullCustomer(
        customer,
        lead,
        phones,
        emails,
      );

      expect(result).toEqual({
        ...getMockedFullCustomer(),
        emails: emails.map(email => ({
          email: email.email,
          isMain: email.isMain,
          id: email.id,
        })),
        phones: phones.map(phone => ({
          phone: phone.phone,
          isMain: phone.isMain,
          id: phone.id,
        })),
      });
    });

    it('should handle missing lead fields', () => {
      const customer: Customer = getMockedCustomer();
      const lead = { ...getMockedLead(), firstname: '', lastname: '', country: '' };
      const phones: Phone[] = [];
      const emails: Email[] = [];

      const result: FullCustomer = UsersUtil.mapCustomerToFullCustomer(
        customer,
        lead,
        phones,
        emails,
      );

      expect(result).toEqual({
        ...getMockedFullCustomer(),
        firstname: '',
        lastname: '',
        country: undefined,
        emails: [],
        phones: [],
      });
    });
  });

  describe(UsersUtil.mapEmailsToCustomerEmails.name, () => {
    it('should map emails to UserEmail array', () => {
      const emails: Email[] = [getMockedEmail(), getMockedMainEmail()];

      const result: UserEmail[] = UsersUtil.mapEmailsToCustomerEmails(emails);

      expect(result).toEqual([
        { email: getMockedEmail().email, isMain: getMockedEmail().isMain },
        { email: getMockedMainEmail().email, isMain: getMockedMainEmail().isMain },
      ]);
    });
  });

  describe(UsersUtil.mapPhonesToUserPhones.name, () => {
    it('should map phones to UserPhone array', () => {
      const phones: Phone[] = [getMockedPhone(), getMockedMainPhone()];

      const result: UserPhone[] = UsersUtil.mapPhonesToUserPhones(phones);

      expect(result).toEqual([
        { phone: getMockedPhone().phone, isMain: getMockedPhone().isMain },
        { phone: getMockedMainPhone().phone, isMain: getMockedMainPhone().isMain },
      ]);
    });
  });
});