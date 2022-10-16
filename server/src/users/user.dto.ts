import { isNotEmpty, IsNotEmpty, Matches, ValidateIf } from "class-validator";
import { Match } from "src/base/match.decorator";

export enum UserErrorsDto {

    InvalidUserLogin = "InvalidUserLogin",
    UserLoginAlreadyExists = "UserLoginAlreadyExists",
    InvalidUserPosition = "InvalidUserPosition",
    InvalidUserRole = "InvalidUserRole",
    InvalidPassword = "InvalidPassword"
}

export class UserDto {

    public id: number;
    public name: string;
    public login: string;
    public role: string;
    public roleId: number;
    public position: string;
    public positionId: number;
    public createdAt: number;
    public updatedAt: number;
    public lastLoginAt: number;
}

export class UserUpdateDto {

    public name: string;

    @IsNotEmpty({ message: UserErrorsDto.InvalidUserLogin })
    public login: string;

    @IsNotEmpty({ message: UserErrorsDto.InvalidUserPosition })
    public positionId: number;

    @IsNotEmpty({ message: UserErrorsDto.InvalidUserRole })
    public roleId: number;

    public password: string;

    @Match('password', { message: UserErrorsDto.InvalidPassword })
    public repassword: string;

}