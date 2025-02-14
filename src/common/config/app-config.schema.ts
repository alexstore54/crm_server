import Joi from 'joi';
import { NodeEnv } from 'common/config/types';
import { AppConfigUtil } from '@/common/config/utils';
import { LogLevel } from '@prisma/client';

export const appConfigValidationSchema = {
  NODE_ENV: Joi.string()
    .equal(...Object.values(NodeEnv))
    .default(NodeEnv.local),
  APP_PORT: Joi.number()
    .default(3000),
  LOG_LEVEL: Joi.string()
    .equal(...Object.values(LogLevel))
    .default(LogLevel.INFO),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
};

export const validationSchema = Joi.object(appConfigValidationSchema);

export const configKeys = AppConfigUtil.getConfigKeys(appConfigValidationSchema);
