import { Module } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
