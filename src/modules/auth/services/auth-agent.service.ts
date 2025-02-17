import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthAgentService {

  public async getProfile() {
    return 'Agent Profile';
  }

  public async getProfileById() {
    return 'Agent Profile';
  }

  public async signIn() {
    return 'Agent Profile';

  }

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