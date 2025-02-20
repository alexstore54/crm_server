import Joi, { ObjectSchema } from 'joi';
import { RouteAccess } from '@prisma/client';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';

export const agentAuthPayloadSchema: ObjectSchema<AgentAuthPayload> = Joi.object({
  descId: Joi.string().optional(),
  routeAccess: Joi.string()
    .valid(...Object.values(RouteAccess))
    .required(),
  sessionUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});

export const customerAuthPayloadSchema: ObjectSchema<CustomerAuthPayload> = Joi.object({
  sessionUUID: Joi.string().uuid().required(),
  sub: Joi.string().required(),
});
