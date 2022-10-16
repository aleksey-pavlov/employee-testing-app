import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError } from 'typeorm';
import { PositionDto, PositionErrorsDto, PositionUpdateDto } from './position.dto';
import { PositionsService } from './positions.service';

@Controller()
export class PositionsController {

    constructor(private positionService: PositionsService) { }

    @Get('/positions')
    @ApiTags('Positions')
    public async getPositions(): Promise<PositionDto[]> {

        return await this.positionService.findAll();
    }

    @Get('/position/:id')
    @ApiTags('Positions')
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async getPosition(@Param('id') id: number): Promise<PositionDto> {

        let position = await this.positionService.findOne(id)
        if (!position)
            throw new NotFoundException();

        return position;
    }

    @Put('/position/:id')
    @ApiTags('Positions')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: PositionUpdateDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ type: BaseModifyResponseDto })
    public async updatePosition(@Param('id') id: number, @Body() data: PositionUpdateDto): Promise<BaseModifyResponseDto> {

        try {
            if (await this.positionService.updateOne(id, data))
                return new BaseModifyResponseDto(id);
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new NotFoundException();
            }

            throw e;
        }

    }

    @Post('/position')
    @ApiTags('Positions')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: PositionUpdateDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    @ApiResponse({ type: BaseModifyResponseDto })
    public async createPosition(@Body() data: PositionUpdateDto): Promise<BaseModifyResponseDto> {

        let exists = await this.positionService.findOneByTitle(data.title)
        if (exists)
            throw new BadRequestException([PositionErrorsDto.PositionAlreadyExists]);

        var role = await this.positionService.insertOne(data);

        return new BaseModifyResponseDto(role.id);
    }

    @Delete('/position/:id')
    @ApiTags('Positions')
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ type: BaseModifyResponseDto })
    public async removePosition(@Param('id') id: number): Promise<BaseModifyResponseDto> {

        if (await this.positionService.deleteOne(id))
            return new BaseModifyResponseDto(id);

        throw new NotFoundException();
    }

}
