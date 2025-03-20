import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";
import { IncomingPermission } from "@/modules/permissions/dto";
import { UseValidation } from "@/common/decorators/validation";

export class CreateRole {
    
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(2, 50)
    name: string

    @UseValidation.validatePermissionsArray()
    permissions: IncomingPermission[]
}

export class UpdateRole {
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(2, 50)
    name: string
}