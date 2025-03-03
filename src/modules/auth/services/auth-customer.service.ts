import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInCustomer } from '@/modules/auth/dto/customer/sign-in.dto';
import { FullCustomer } from '@/shared/types/user';
import { CustomersRepository, EmailRepository, LeadRepository } from '@/modules/user/repositories';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { SignUpCustomer } from '@/modules/auth/dto/customer';
import { Lead, Prisma } from '@prisma/client';
import { getMockedFullCustomer } from '@/shared/mocks/customer';
import { PrismaService } from '@/shared/db/prisma';

@Injectable()
export class AuthCustomerService {
  constructor(
    private readonly customerRepository: CustomersRepository,
    private readonly leadRepository: LeadRepository,
    private readonly emailRepository: EmailRepository,
    private readonly prisma: PrismaService,
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
    const { email, password, phone, firstname, lastname } = data;
    // Проверяем наличие пользователя с таким email
    const customer = await this.customerRepository.findOneByEmail(email);
    if (customer) {
      throw new BadRequestException(ERROR_MESSAGES.USER_EXISTS);
    }
    // Проверяем наличие лида с таким телефоном
    const existingLead = await this.leadRepository.findOneByPhone(phone);

    if (!existingLead) {
      //Создание полноценного лида, если зарегался с улицы
      return this.makeLeadAndCustomer(data);
    }

    // Если лид уже есть, то проверяем, не является ли он уже клиентом (у него мог быть указан другой email)
    const isLeadAlreadyCustomer = await this.customerRepository.findOneByLeadId(existingLead.id);

    // Если является, то обновляем данные лида и присваиваем ему дополнительный email
    if (isLeadAlreadyCustomer) {
      // Нам не важна последовательность выполнения запросов, поэтому используем Promise.all
      await Promise.all([
        this.leadRepository.updateOneById(existingLead.id, {
          ...existingLead,
          firstname,
          lastname,
        }), // Перезаписываем firstname и lastname. Пароль не перезаписываем!!!
        this.emailRepository.createOne(email, isLeadAlreadyCustomer.id), // Присваиваем дополнительный email
      ]);
      // Выбрасываем ошибку, чтобы не выдавать токены доступа. Задача сохранить новые данные, но не давать доступ в систему
      throw new BadRequestException(ERROR_MESSAGES.USER_EXISTS);
    }

    // Если есть лид с таким номером телефона, но не является клиентом, то создаем нового клиента (с уллицы)
    return this.makeCustomerFromLead(existingLead, password);
  }

  private async makeCustomerFromLead(
    lead: Lead,
    password: string,
    tx?: Prisma.TransactionClient,
  ): Promise<FullCustomer> {
    if (tx) {
      return this.customerRepository.createOneWithTx(
        {
          password,
          leadId: lead.id,
          email: lead.defaultEmail,
        },
        tx,
      );
    } else {
      return this.customerRepository.createOne({
        password,
        leadId: lead.id,
        email: lead.defaultEmail,
      });
    }
  }

  private async makeLeadAndCustomer(data: SignUpCustomer): Promise<FullCustomer> {
    const { password, firstname, lastname, phone, email } = data;

    //return getMockedFullCustomer();
    return this.prisma.$transaction(async (tx) => {
      const newLead = await this.leadRepository.createOneWithTx(
        { firstname, lastname, phone, email },
        true,
        tx,
      );

      return this.makeCustomerFromLead(newLead, password);
    });
  }
}
