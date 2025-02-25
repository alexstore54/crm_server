import Joi, { ObjectSchema } from 'joi';
import { RouteAccess } from '@prisma/client';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';

export const agentAuthPayloadSchema: ObjectSchema<AgentAuthPayload> = Joi.object({
  descId: Joi.string().optional(),
  routeAccess: Joi.string()
    .valid(...Object.values(RouteAccess))
    .required(),
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});

export const customerAuthPayloadSchema: ObjectSchema<CustomerAuthPayload> = Joi.object({
  payloadUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});
