import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInCustomer } from '@/modules/auth/dto/customer/sign-in.dto';
import { FullCustomer } from '@/shared/types/user';
import { CustomersRepository, LeadRepository } from '@/modules/users/repositories';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { SignUpCustomer } from '@/modules/auth/dto/customer';
import { Lead } from '@prisma/client';

@Injectable()
export class AuthCustomerService {
  constructor(
    private readonly customerRepository: CustomersRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  public async validate(data: SignInCustomer): Promise<FullCustomer> {
    const { email, password } = data;
    const customer = await this.customerRepository.findOneByEmail(email);
    if (!customer) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    const isPasswordMatch = password === customer.password;

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    return customer;
  }

  public async signUp(data: SignUpCustomer): Promise<FullCustomer> {
    const { email, password, phone } = data;
    const customer = await this.customerRepository.findOneByEmail(email);
    if (customer) {
      throw new BadRequestException(ERROR_MESSAGES.USER_EXISTS);
    }
    const existingLead = await this.leadRepository.findOneByPhone(phone);

    if (!existingLead) {
      return this.makeLeadAndCustomer(data);
    }

    return this.makeCustomerFromLead(existingLead, password);
  }

  private async makeCustomerFromLead(lead: Lead, password: string): Promise<FullCustomer> {
    return this.customerRepository.createOne({
      password,
      leadId: lead.id,
      lastTimeOnline: new Date(),
    });
  }

  private async makeLeadAndCustomer(data: SignUpCustomer): Promise<FullCustomer> {
    const { password, firstname, phone, lastname, email, country } = data;
    const newLead = await this.leadRepository.createOne({
      defaultEmail: email,
      firstname: firstname,
      lastname: lastname,
      country,
    });
    return this.makeCustomerFromLead(newLead, password);
  }
}