import { Injectable } from '@nestjs/common';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { ClientsGateway } from '@/shared/gateway';
import { CreateSessionInput, Session, SessionId } from '@/shared/types/auth';
import { MakeSessionArgs } from '@/modules/auth/types/auth-args.type';
import { BcryptHelper } from '@/shared/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly clientService: ClientsGateway,
  ) {
  }

  public async makeSession(args: MakeSessionArgs): Promise<SessionId> {
    const hashedRefreshToken: string = await BcryptHelper.hash(args.refreshToken);
    const inputParams = this.mapSession(args, hashedRefreshToken);

    return this.sessionService.saveUserSession(inputParams);
  }


  private mapSession(args: MakeSessionArgs, hashedRefreshToken: string): CreateSessionInput {
    const { user, userAgent, refreshToken, fingerprint } = args;
    return {
      userId: user.id,
      isOnline: true,
      hashedRefreshToken,
      fingerprint,
      userAgent,
    };
  }
}