import { Controller } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.AUTH_GOOGLE.BASE)
export class AuthGoogleController {}
