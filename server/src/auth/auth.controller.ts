import { Controller, Post, Body, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto, LoggedUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @ApiResponse({type: LoggedUserDto})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: HttpStatus[HttpStatus.UNAUTHORIZED]})
    public async login(@Body() data: LoginDto, @Request() req): Promise<LoggedUserDto> {
        return await this.authService.login(req.user);
    }
}
