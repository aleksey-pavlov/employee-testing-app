import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EntityNotFoundError } from 'typeorm';
import { UserTestAlreadyStarted, UserTestDto, UserTestIsFinished, UserTestPostAnswerDto, UserTestPostAnswerResponseDto } from './user-tests.dto';
import { UserTestsService } from './user-tests.service';

@Controller()
export class UserTestsController {

    constructor(private userTestsService: UserTestsService) { }

    @Post('/user/:userId/test/:testId/start')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    public async startUserTest(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('testId', ParseIntPipe) testId: number
    ) {
        try {
            return await this.userTestsService.startTest(userId, testId);
        } catch (e) {
            if (e instanceof EntityNotFoundError)
                throw new NotFoundException();
            if (e instanceof UserTestAlreadyStarted)
                throw new BadRequestException(e.message);
        }
    }

    @Get('/user/:userId/tests')
    @ApiTags('UserTests')
    public async getUserTests(@Param('userId', ParseIntPipe) userId: number): Promise<UserTestDto[]> {

        return await this.userTestsService.findAll(userId);
    }

    @Get('/user/:userId/test/:userTestId')
    @ApiTags('UserTests')
    public async getUserTest(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('userTestId', ParseIntPipe) userTestId: number): Promise<UserTestDto> {

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
    public async finishUserTest(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('userTestId', ParseIntPipe) userTestId: number
    ) {
        return await this.userTestsService.finishTest(userTestId);
    }

    @Post('/user/:userId/test/:userTestId/question/:questionId')
    @ApiTags('UserTests')
    @ApiBody({ type: UserTestPostAnswerDto })
    public async postTestQuestionAnswer(
        @Param('userId') userId: number,
        @Param('userTestId') userTestId: number,
        @Param('questionId') questionId: number,
        @Body() data: UserTestPostAnswerDto
    ): Promise<UserTestPostAnswerResponseDto> {

        try {
            return await this.userTestsService.commitAnswer(userId, userTestId, questionId, data);
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
    public async removeUserTest(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('userTestId', ParseIntPipe) userTestId: number
    ) {
        await this.userTestsService.removeTest(userTestId);
    }

}
