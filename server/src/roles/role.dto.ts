import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export enum RolesErrorsDto {
    InvalidRoleName = "InvalidRoleName",
    RoleAlreadyExists = "RoleAlreadyExists"
}


export interface RoleDto {

    id: number;
    name: string;
}

export class RoleUpdateDto {

    @ApiProperty()
    @IsNotEmpty({ message: RolesErrorsDto.InvalidRoleName })
    public name: string;
}