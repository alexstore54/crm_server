import Joi from 'joi';
import { NodeEnv } from '@/common/config/types';
import { LogLevel } from '@prisma/client';
import { SchemaUtil } from '@/shared/utils';

export const appConfigValidationSchema = {
  NODE_ENV: Joi.string()
    .equal(...Object.values(NodeEnv))
    .default(NodeEnv.local),
  APP_PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string()
    .equal(...Object.values(LogLevel))
    .default(LogLevel.INFO),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  CORS_ORIGIN: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
  CSRF_SECRET: Joi.string().required(),
  SOCKET_URL: Joi.string().uri().required(),
  MODERATOR_EMAIL: Joi.string().email().required(),
  MODERATOR_HASH_PASSWORD: Joi.string().required(),
};

export const validationSchema = Joi.object(appConfigValidationSchema);

export const configKeys = SchemaUtil.getConfigKeys(appConfigValidationSchema);
