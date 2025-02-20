import { Module } from '@nestjs/common';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { ClientsGateway } from '@/shared/gateway/clients.gateway';
import { SessionsModule } from '@/shared/services';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [SessionsModule],
  providers: [ClientsGateway, GatewayService, JwtService],
  exports: [ClientsGateway, GatewayService],
})
export class GatewayModule {}