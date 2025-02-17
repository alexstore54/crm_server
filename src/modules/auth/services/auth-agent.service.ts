import { Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AuthTokens } from '@/shared/types/auth';

@Injectable()
export class AuthAgentService {

  public async getProfile() {
    return 'Agent Profile';
  }

  public async getProfileById() {
    return 'Agent Profile';
  }

  // public async signIn(data: SignInAgent): Promise<AuthTokens | null> {
  //     const { email, password } = data;
  //
  // }

  public async signUp() {
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