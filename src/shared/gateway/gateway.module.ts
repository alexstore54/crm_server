import { Module } from '@nestjs/common';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { BaseGateway } from '@/shared/gateway/base.gateway';

@Module({
  providers: [BaseGateway, GatewayService],
  exports: [BaseGateway],
})
export class GatewayModule {
}