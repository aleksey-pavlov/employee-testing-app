import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {

        try {
            const user = await this.authService.findUser(new LoginDto(username, password));

            if (!user) {
                throw new UnauthorizedException();
            }

            return user;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}