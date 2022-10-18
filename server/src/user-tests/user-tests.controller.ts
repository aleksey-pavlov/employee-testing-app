import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError } from 'typeorm';
import { UserTestDto, UserTestIsFinished, UserTestPostAnswerDto, UserTestPostAnswerResponseDto } from './user-tests.dto';
import { UserTestsService } from './user-tests.service';

@Controller()
export class UserTestsController {

    constructor(private userTestsService: UserTestsService) { }

    @Post('/user/:userId/test/:testId/start')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    @ApiResponse({ type: UserTestDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async startUserTest(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('testId', ParseIntPipe) testId: number): Promise<UserTestDto> {

        try {
            return await this.userTestsService.startTest(userId, testId);
        } catch (e) {
            if (e instanceof EntityNotFoundError)
                throw new NotFoundException();
        }
    }

    @Get('/user/:userId/tests')
    @ApiTags('UserTests')
    @ApiResponse({ type: UserTestDto, isArray: true })
    public async getUserTests(@Param('userId', ParseIntPipe) userId: number): Promise<UserTestDto[]> {

        return await this.userTestsService.findAll(userId);
    }

    @Get('/user/:userId/test/:userTestId')
    @ApiTags('UserTests')
    @ApiResponse({ type: UserTestDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async getUserTest(@Param('userTestId', ParseIntPipe) userTestId: number): Promise<UserTestDto> {

        try {
            return await this.userTestsService.findOne(userTestId);
        } catch (e) {
            if (e instanceof EntityNotFoundError)
                throw new NotFoundException();
        }
    }

    @Post('/user/:userId/test/:userTestId/finish')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async finishUserTest(@Param('userTestId', ParseIntPipe) userTestId: number) {

        return await this.userTestsService.finishTest(userTestId);
    }

    @Post('/user/:userId/test/:userTestId/question/:questionId')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    @ApiResponse({ type: UserTestPostAnswerResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: HttpStatus[HttpStatus.BAD_REQUEST] })
    public async postTestQuestionAnswer(
        @Param('userTestId') userTestId: number,
        @Param('questionId') questionId: number,
        @Body() data: UserTestPostAnswerDto): Promise<UserTestPostAnswerResponseDto> {

        try {
            return await this.userTestsService.commitAnswer(userTestId, questionId, data);
        } catch (e) {
            if (e instanceof EntityNotFoundError)
                throw new NotFoundException()
            if (e instanceof UserTestIsFinished)
                throw new BadRequestException(e.message);
        }
    }

    @Delete('/user/:userId/test/:userTestId')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: HttpStatus[HttpStatus.NOT_FOUND] })
    public async removeUserTest(@Param('userTestId', ParseIntPipe) userTestId: number): Promise<BaseModifyResponseDto> {

        if (await this.userTestsService.removeTest(userTestId))
            return new BaseModifyResponseDto(userTestId);
    }

}
