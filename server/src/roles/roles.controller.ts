import { Controller, Get, Put, HttpStatus, Query, Body, UsePipes, ValidationPipe, Post, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { RoleDto, RoleUpdateDto, RolesErrorsDto } from './role.dto';
import { RolesService } from './roles.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError } from 'typeorm';


@Controller()
export class RolesController {

    constructor(private rolesService: RolesService) {

    }

    @Get('/roles')
    @ApiTags('Roles')
    public async getRoles(): Promise<RoleDto[]> {
        return await this.rolesService.findAll();
    }

    @Get('/role/:id')
    @ApiTags('Roles')
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async getRole(@Param('id', ParseIntPipe) id: number): Promise<RoleDto> {
        let role = await this.rolesService.findOne(id);
        if (!role)
            throw new NotFoundException();

        return role;
    }

    @Put('/role/:id')
    @ApiTags('Roles')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: RoleUpdateDto })
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async updateRole(@Param('id', ParseIntPipe) id: number, @Body() data: RoleUpdateDto): Promise<BaseModifyResponseDto> {
        try {
            if (await this.rolesService.updateOne(id, data))
                return new BaseModifyResponseDto(id);
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    @Post('/role')
    @ApiTags('Roles')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: RoleUpdateDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async createRole(@Body() data: RoleUpdateDto): Promise<BaseModifyResponseDto> {
        let exists = await this.rolesService.findOneByName(data.name)
        if (exists)
            throw new BadRequestException([RolesErrorsDto.RoleAlreadyExists]);

        var role = await this.rolesService.insertOne(data);

        return new BaseModifyResponseDto(role.id);
    }

    @Delete('/role/:id')
    @ApiTags('Roles')
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async removeRole(@Param('id', ParseIntPipe) id: number): Promise<BaseModifyResponseDto> {
        if (await this.rolesService.deleteOne(id))
            return new BaseModifyResponseDto(id);

        throw new NotFoundException();
    }
}
