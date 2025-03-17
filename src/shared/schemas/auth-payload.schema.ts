import Joi, { ObjectSchema } from 'joi';
import { CustomerAuthPayload } from '@/shared/types/auth';

export const agentAuthPayloadSchema: ObjectSchema<string> = Joi.object({
  desksPublicId: Joi.array().items(Joi.string().uuid()).required(),
  teamsPublicId: Joi.array().items(Joi.string().uuid()).required(),
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
  iat: Joi.number().optional(),
  exp: Joi.number().optional(),
});

export const customerAuthPayloadSchema: ObjectSchema<CustomerAuthPayload> = Joi.object({
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
  iat: Joi.number().optional(),
  exp: Joi.number().optional(),
});
