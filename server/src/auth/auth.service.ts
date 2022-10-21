import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from 'src/roles/role.dto';
import { UserDto } from 'src/users/user.dto';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { EntityNotFoundError } from 'typeorm';
import { LoginDto, LoggedUserDto, AclMap } from './auth.dto';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) { }


    public async findUser(data: LoginDto): Promise<UserDto> {

        let user = await this.userService.findByLogin(data.username);

        if (!user)
            throw new EntityNotFoundError(UserEntity, { login: data.username });

        if (AuthHelper.hasPassword(data.password) != user.password)
            throw new EntityNotFoundError(UserEntity, { password: data.password })

        return user.toUserDto();
    }

    async login(user: UserDto): Promise<LoggedUserDto> {

        await this.userService.updateLasLoginDate(user.id);

        const payload = { username: user.login, userId: user.id, role: user.role };

        return {
            login: user.login,
            name: user.name,
            userId: user.id,
            token: this.jwtService.sign(payload),
            acl: this.getRoleAcl(user.role),
            role: user.role
        };
    }

    getRoleAcl(role: RolesEnum) {
        return AclMap[role];
    }
}
