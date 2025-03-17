import { Customer, Email, Lead, Phone } from '@prisma/client';
import { FullCustomer, UserEmail, UserPhone } from '@/shared/types/user';

export class UsersUtil {
  public static mapCustomerToFullCustomer(
    customer: Customer,
    lead: Lead,
    phones: Phone[],
    emails: Email[],
  ): FullCustomer {
    return {
      id: customer.id,
      publicId: customer.publicId,
      firstname: lead?.firstname || '',
      lastname: lead?.lastname || '',
      country: lead?.country || undefined,
      password: customer.password,
      emails: this.mapEmailsToCustomerEmails(emails),
      phones: this.mapPhonesToUserPhones(phones),
    };
  }

  public static mapEmailsToCustomerEmails(emails: Email[]): UserEmail[] {
    return emails.map((email) => ({
      email: email.email,
      isMain: email.isMain,
      id: email.id,
    }));
  }

  public static mapPhonesToUserPhones(phones: Phone[]): UserPhone[] {
    return phones.map((phone) => ({
      phone: phone.phone,
      isMain: phone.isMain,
      id: phone.id,
    }));
  }
}
