import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfigValidationSchema } from '@/common/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: appConfigValidationSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
