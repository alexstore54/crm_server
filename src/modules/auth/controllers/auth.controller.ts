import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('csrf-token')
  async getCsrfToken() {
    return;
  }
}
