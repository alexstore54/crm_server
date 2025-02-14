import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { configKeys } from '@/common/config';

dotenv.config();

export class BcryptHelper {
  private static readonly saltRounds =
    process.env[configKeys.BCRYPT_SALT_ROUNDS] as string;

  public static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public static async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
