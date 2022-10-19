import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export enum RolesEnum {
    ADMIN = 'Admin',
    USER = 'User'
}

export enum RolesErrorsDto {
    InvalidRoleName = "InvalidRoleName",
    RoleAlreadyExists = "RoleAlreadyExists"
}

export class RoleDto {

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;
}

export class RoleUpdateDto {

    @ApiProperty()
    @IsNotEmpty({ message: RolesErrorsDto.InvalidRoleName })
    public name: RolesEnum;
}