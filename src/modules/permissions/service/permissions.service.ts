import { Injectable } from '@nestjs/common';
import { IncomingPermission } from '@/modules/permissions/dto';
import { PermissionRepository } from '@/modules/permissions/repositories';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionRepository) {}

  public async isPermissionsValid(
    incomingPermissions: IncomingPermission[],
  ): Promise<boolean> {
    const idsArray = incomingPermissions.map((permission) => permission.id);
    const permissions = await this.permissionsRepository.findManyByIds(idsArray);
    return permissions.length === incomingPermissions.length;
  }

  public async txIsPermissionsValid(
    incomingPermissions: IncomingPermission[],
    tx: Prisma.TransactionClient,
  ): Promise<boolean> {
    const idsArray = incomingPermissions.map((permission) => permission.id);
    const permissions = await this.permissionsRepository.txFindManyByIds(idsArray, tx);
    return permissions.length === incomingPermissions.length;
  }

}
