import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { configKeys } from '@/shared/schemas';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

dotenv.config();

export class BcryptHelper {
  private static readonly saltRounds = process.env[configKeys.BCRYPT_SALT_ROUNDS] as string;

  public static async hash(str: string): Promise<string> {
    try {
      return bcrypt.hash(str, Number(this.saltRounds));
    } catch (error: any) {
      
      throw new InternalServerErrorException(ERROR_MESSAGES.BCRYPT);
    }
  }

  public static async compare(str: string, hash: string): Promise<boolean> {
    try {
      return bcrypt.compare(str, hash);
    } catch (error: any) {
      throw new InternalServerErrorException(ERROR_MESSAGES.BCRYPT);
    }
  }
}
