import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { RolesEnum } from 'src/roles/role.dto';
import { Roles } from 'src/roles/roles.decorator';
import { EntityNotFoundError } from 'typeorm';
import { TestDto, TestShortDto } from './test.dto';
import { TestsService } from './tests.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Tests')
export class TestsController {

    constructor(private testsService: TestsService) { }

    @Get('/tests')
    @ApiResponse({ type: TestDto, isArray: true })
    public async getTests(): Promise<TestShortDto[]> {

        return await this.testsService.findAll();
    }
    
    @Get('/test/:id')
    @Roles(RolesEnum.ADMIN)
    @ApiResponse({ type: TestDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async getTest(@Param('id', ParseIntPipe) id: number): Promise<TestDto> {

        let test = await this.testsService.findOne(id);
        if (!test)
            throw new NotFoundException();


        return test;
    }

    @Post('/test')
    @Roles(RolesEnum.ADMIN)
    @ApiBody({ type: TestDto })
    @UsePipes(new ValidationPipe())
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async createTest(@Body() data: TestDto): Promise<BaseModifyResponseDto> {

        let test = await this.testsService.insertOne(data);

        return new BaseModifyResponseDto(test.id);
    }

    @Put('/test/:id')
    @Roles(RolesEnum.ADMIN)
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: TestDto })
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async updateTest(@Param('id', ParseIntPipe) id: number, @Body() data: TestDto): Promise<BaseModifyResponseDto> {

        try {

            let updated = await this.testsService.updateOne(id, data);
            if (updated)
                return new BaseModifyResponseDto(updated.id);

        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new NotFoundException();
            }

            throw e;
        }
    }

    @Delete('/test/:id')
    @Roles(RolesEnum.ADMIN)
    @ApiResponse({ type: BaseModifyResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async deleteTest(@Param('id', ParseIntPipe) id: number): Promise<BaseModifyResponseDto> {

        let deleted = await this.testsService.deleteOne(id);
        if (deleted)
            return new BaseModifyResponseDto(id);

        throw new NotFoundException();
    }
}
