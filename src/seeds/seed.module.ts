import { Module } from '@nestjs/common';
import { SeedService } from '@/seeds/seed.service';

@Module({
  providers: [SeedService],
})
export class SeedModule {}