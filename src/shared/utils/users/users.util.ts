import { Email, Lead, Phone } from '@prisma/client';
import { CustomerEmail, FullLead, LeadForClient, PrismaLead, UserPhone } from 'shared/types/user';

export class UsersUtil {
  // public static mapCustomerToFullCustomer(
  //   customer: Customer,
  //   lead: Lead,
  //   phones: Phone[],
  //   emails: Email[],
  // ): FullLead {
  //   return {
  //     id: customer.id,
  //     publicId: customer.publicId,
  //     firstname: lead?.firstname || '',
  //     lastname: lead?.lastname || '',
  //     country: lead?.country || undefined,
  //     password: customer.password,
  //     emails: this.mapEmailsToCustomerEmails(emails),
  //     phones: this.mapPhonesToUserPhones(phones),
  //   };
  // }

  public static mapPrismaLeadToFullLead(prismaLead: PrismaLead): FullLead {
    const { lead, customerInfo } = prismaLead;
    return {
      lead: {
        id: lead.id,
        firstname: lead.firstname,
        lastname: lead.lastname,
        country: lead.country,
        defaultEmail: lead.defaultEmail,
        publicId: lead.publicId,
        avatarURL: customerInfo?.avatarURL || null,
      },
      adminInfo: {
        desk: lead.Desk,
        team: lead.Team,
        status: lead.LeadStatus,
        lastOnline: customerInfo?.lastOnline || null,
      },
      createdAt: lead.createdAt,
      isVerified: lead.isVerified,
      updatedAt: lead.updatedAt,
    };
  }

  public static mapLeadToClientLead(lead: Lead): LeadForClient {
    return {
      id: lead.id,
      publicId: lead.publicId,
      firstname: lead.firstname,
      lastname: lead.lastname,
      country: lead.country,
      defaultEmail: lead.defaultEmail,
    };
  }


  public static mapEmailsToCustomerEmails(emails: Email[]): CustomerEmail[] {
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
