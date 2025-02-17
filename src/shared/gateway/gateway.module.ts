import { Module } from '@nestjs/common';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { ClientsGateway } from '@/shared/gateway/clients.gateway';
import { SessionsModule } from '@/shared/services';

@Module({
  imports: [SessionsModule],
  providers: [ClientsGateway, GatewayService],
  exports: [ClientsGateway, GatewayService],
})
export class GatewayModule {
}