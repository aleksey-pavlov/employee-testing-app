import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError } from 'typeorm';
import { UserDto, UserErrorsDto, UserUpdateDto } from './user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get('/users')
    @ApiTags('Users')
    public async getAllUsers(): Promise<UserDto[]> {
        return await this.usersService.findAll();
    }

    @Get('/user/:id')
    @ApiTags('Users')
    @ApiResponse({ type: UserDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {

        let user = await this.usersService.findById(id);

        if (!user)
            throw new NotFoundException();

        return user;
    }

    @Put('/user/:id')
    @ApiTags('Users')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: UserUpdateDto })
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UserUpdateDto): Promise<BaseModifyResponseDto> {

        try {

            if (await this.usersService.updateOne(id, data))
                return new BaseModifyResponseDto(id);

        } catch (e) {
            if (e instanceof EntityNotFoundError)
                throw new NotFoundException();

            throw e;
        }
    }

    @Post('/user')
    @ApiTags('Users')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: UserUpdateDto })
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async createUser(@Body() data: UserUpdateDto): Promise<BaseModifyResponseDto> {
        
        let exists = await this.usersService.findByLogin(data.login);
        if (exists)
            throw new BadRequestException([UserErrorsDto.UserLoginAlreadyExists]);

        let user = await this.usersService.insertOne(data);

        return new BaseModifyResponseDto(user.id);
    }

    @Delete("/user/:id")
    @ApiTags('Users')
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async removeUser(@Param('id', ParseIntPipe) id: number): Promise<BaseModifyResponseDto> {
        if (await this.usersService.deleteOne(id))
            return new BaseModifyResponseDto(id);

        throw new NotFoundException();
    }
}
