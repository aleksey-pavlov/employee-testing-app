import { ApiProperty } from "@nestjs/swagger";
import { isNotEmpty, IsNotEmpty, Matches, ValidateIf } from "class-validator";
import { Match } from "src/base/match.decorator";
import { RolesEnum } from "src/roles/role.dto";

export enum UserErrorsDto {

    InvalidUserLogin = "InvalidUserLogin",
    UserLoginAlreadyExists = "UserLoginAlreadyExists",
    InvalidUserPosition = "InvalidUserPosition",
    InvalidUserRole = "InvalidUserRole",
    InvalidPassword = "InvalidPassword"
}

export class UserDto {

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public login: string;

    @ApiProperty()
    public role: RolesEnum;

    @ApiProperty()
    public roleId: number;
    
    @ApiProperty()
    public position: string;

    @ApiProperty()
    public positionId: number;

    @ApiProperty()
    public createdAt: number;

    @ApiProperty()
    public updatedAt: number;

    @ApiProperty()
    public lastLoginAt: number;
}

export class UserUpdateDto {

    @ApiProperty()
    public name: string;

    @ApiProperty()
    @IsNotEmpty({ message: UserErrorsDto.InvalidUserLogin })
    public login: string;

    @ApiProperty()
    @IsNotEmpty({ message: UserErrorsDto.InvalidUserPosition })
    public positionId: number;

    @ApiProperty()
    @IsNotEmpty({ message: UserErrorsDto.InvalidUserRole })
    public roleId: number;

    @ApiProperty()
    public password: string;

    @ApiProperty()
    @Match('password', { message: UserErrorsDto.InvalidPassword })
    public repassword: string;

}