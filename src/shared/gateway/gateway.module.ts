import { Module } from '@nestjs/common';
import { GatewayClientsService } from '@/shared/gateway/gateway-clients.service';
import { GatewayService } from '@/shared/gateway/gateway.service';

@Module({
  providers: [GatewayService, GatewayClientsService],
  exports: [GatewayService],
})
export class GatewayModule {
}