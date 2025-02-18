import { Module } from '@nestjs/common';

import { LeadsController } from './controllers/leads.controller';
import { LeadsService } from './services/leads.service';

@Module({
  providers: [LeadsService],
  controllers: [LeadsController]
})
export class LeadsModule {}
