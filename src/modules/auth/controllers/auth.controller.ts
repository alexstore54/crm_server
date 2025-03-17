import { Controller, Get } from '@nestjs/common';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.AUTH.BASE)
export class AuthController {
  @Get(ENDPOINTS.AUTH.GET_CSRF_TOKEN)
  public async getCsrfToken(): Promise<void> {
  }
}
