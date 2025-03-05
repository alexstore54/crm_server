import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationService } from '@/shared/services/validation/validation.service';
import { LeadPermissionValidation } from '@/shared/types/validation';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class LeadPermissionGuard implements CanActivate {
  constructor(private readonly validationService: ValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params, body, operation, permissions } = request;

    if (!permissions || !operation) {
      throw new InternalServerErrorException(ERROR_MESSAGES.PERMISSIONS_NOT_PROVIDED);
    }

    const validationArgs: LeadPermissionValidation = {
      operation,
      permissions,
      currentAgentPayload: user,
      leadPublicId: params.publicId || body.publicId,
    };

    try {
      return await this.validationService.validateLeadOperationPermissions(validationArgs);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

}
