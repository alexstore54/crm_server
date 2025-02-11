import * as bcrypt from 'bcrypt';

export class BcryptHelper {
  private static readonly saltRounds = 5;

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
