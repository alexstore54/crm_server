import { Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AuthTokens } from '@/shared/types/auth';
import { SignUpAgent } from '@/modules/auth/dto/agent/sign-up.dto';

@Injectable()
export class AuthAgentService {

  public async getProfile() {
    return 'Agent Profile';
  }

  public async getProfileById() {
    return 'Agent Profile';
  }

  public async signIn(data: SignInAgent): Promise<any> {
      const { email, password } = data;

  }

  public async signUp(data: SignUpAgent): Promise<any> {
    return 'Agent Profile';
  }

  public async logout() {
    return 'Agent Profile';

  }

  public async forgotPassword() {
    return 'Agent Profile';

  }

  public async updateProfile() {
    return 'Agent Profile';

  }

  public async deleteProfile() {
    return 'Agent Profile';

  }
}