import Joi, { ObjectSchema } from 'joi';
import { CustomerAuthPayload } from '@/shared/types/auth';

export const agentAuthPayloadSchema: ObjectSchema<string> = Joi.object({
  deskPublicId: Joi.string().uuid().required(),
  teamPublicId: Joi.string().uuid().optional(),
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});

export const customerAuthPayloadSchema: ObjectSchema<CustomerAuthPayload> = Joi.object({
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});
