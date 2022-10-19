import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/roles/role.dto';

@Injectable()
export class OwnerGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        let request = context.switchToHttp().getRequest();

        let actuallyUserId = request.params.userId;

        if (!actuallyUserId)
            return true;

        const { user } = context.switchToHttp().getRequest();

        return user.userId == Number(actuallyUserId) || user.role == RolesEnum.ADMIN;
    }
}