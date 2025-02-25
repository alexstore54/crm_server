import { Module } from '@nestjs/common';
import { SessionsService } from '@/shared/services/redis/sessions/sessions.service';

@Module({
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
