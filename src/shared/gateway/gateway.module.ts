import { Module } from '@nestjs/common';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { ClientsGateway } from '@/shared/gateway/clients.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthRedisModule } from '@/shared/services/redis/auth-redis';

@Module({
  imports: [AuthRedisModule],
  providers: [ClientsGateway, GatewayService, JwtService],
  exports: [ClientsGateway, GatewayService],
})
export class GatewayModule {}
