import { Controller } from '@nestjs/common';
import {ENDPOINTS} from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.DESK.BASE)
export class DeskController {
  constructor() {
  }
}