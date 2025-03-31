import { Controller } from '@nestjs/common';
import {ENDPOINTS} from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.LEADS_CALLBACK.BASE)
export class LeadsCallBackController {
}