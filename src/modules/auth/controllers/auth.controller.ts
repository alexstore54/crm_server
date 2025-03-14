import { Controller, Get } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.AUTH.BASE)
export class AuthController {
  @Get(ENDPOINTS.AUTH.GET_CSRF_TOKEN)
  async getCsrfToken() {
    return;
  }
}
