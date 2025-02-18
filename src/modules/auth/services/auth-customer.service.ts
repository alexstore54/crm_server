import { Injectable } from '@nestjs/common';
import { SignUpAgent } from '@/modules/auth/dto/agent/sign-up.dto';
import { SignInUser } from '@/modules/auth/dto/user/sign-in.dto';

@Injectable()
export class AuthCustomerService {
  public async getProfile() {
    return 'Customer Profile';
  }

  public async getProfileById() {
    return 'Customer Profile';
  }

  public async signIn(data: SignInUser): Promise<any> {
    const { email, password } = data;
  }

  public async signUp(data: SignUpAgent): Promise<any> {
    return 'Customer Profile';
  }
}