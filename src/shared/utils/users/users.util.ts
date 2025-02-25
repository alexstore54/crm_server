import { Customer, Email, Lead, Phone } from '@prisma/client';
import { UserEmail, FullCustomer, UserPhone } from '@/shared/types/user';

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
      firstname: lead.firstname,
      country: lead?.country || undefined,
      password: customer.password,
      lastname: lead.lastname,
      emails: this.mapEmailsToCustomerEmails(emails),
      phones: this.mapPhonesToUserPhones(phones),
      lastTimeOnline: customer.lastOnline,
    };
  }

  public static mapEmailsToCustomerEmails(emails: Email[]): UserEmail[] {
    return emails.map((email) => ({
      email: email.email,
      isMain: email.isMain,
    }));
  }

  public static mapPhonesToUserPhones(phones: Phone[]): UserPhone[] {
    return phones.map((phone) => ({
      phone: phone.phone,
      isMain: phone.isMain,
    }));
  }
}
