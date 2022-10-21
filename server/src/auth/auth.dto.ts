import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { RolesEnum } from "src/roles/role.dto";
import { AuthHelper } from "./auth.helper";

export class LoginDto {

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    @IsNotEmpty()
    @ApiProperty()
    public username: string;

    @IsNotEmpty()
    @Transform(d => AuthHelper.hasPassword(d.value))
    @ApiProperty()
    public password: string;
}

export class LoggedUserDto {

    @ApiProperty()
    public token: string;

    @ApiProperty()
    public userId: number;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public login: string;

    @ApiProperty()
    public role: RolesEnum;

    @ApiProperty()
    public acl: AclMapActions
}

export enum ComponentsEnum {
    USERS = "Users",
    ROLES = "Roles",
    POSITIONS = "Positions",
    TESTS = "Tests",
    USERTESTS = "UserTests"
}

export enum ComponentActionsEnum {
    VIEW = "View",
    EDIT = "Edit"
}

export type AclMapActions = { [c in ComponentsEnum]?: ComponentActionsEnum[] };
export type AclMapType = { [key in RolesEnum]: AclMapActions };

export const AclMap: AclMapType = {

    [RolesEnum.ADMIN]: {
        [ComponentsEnum.USERS]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
        [ComponentsEnum.ROLES]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
        [ComponentsEnum.POSITIONS]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
        [ComponentsEnum.TESTS]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
        [ComponentsEnum.USERTESTS]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
    },

    [RolesEnum.USER]: {
        [ComponentsEnum.TESTS]: [ ComponentActionsEnum.VIEW ],
        [ComponentsEnum.USERTESTS]: [ ComponentActionsEnum.EDIT, ComponentActionsEnum.VIEW ],
    }
}
