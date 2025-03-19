import { Controller } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import e from 'express';

@Controller(ENDPOINTS.MEDIA.BASE)
export class MediaController {}