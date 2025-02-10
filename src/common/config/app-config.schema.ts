import Joi from 'joi';
import { NodeEnv } from '@/common/config/enums';
import { AppConfigUtil } from '@/common/config/utils';

export const appConfigValidationSchema = {
  NODE_ENV: Joi.string()
    .equal(...Object.values(NodeEnv))
    .default('local'),
  APP_PORT: Joi.number()
    .default(3000),
};

export const validationSchema = Joi.object(appConfigValidationSchema);

export const configKeys = AppConfigUtil.getConfigKeys(appConfigValidationSchema);
