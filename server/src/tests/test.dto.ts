import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from "class-validator";

export enum TestErrorsDto {
    InvalidTestTitle = "InvalidTestTitle",
    TestMustContainQuestions = "TestMustContainQuestions"
}

export class TestShortDto {

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public createAt: number;

    @ApiProperty()
    public updateAt: number;
}

export class TestQuestionAnswerDto {

    @ApiProperty()
    @IsNumber()
    public id?: number;

    @ApiProperty()
    @IsNotEmpty()
    public body: string;

    @ApiProperty()
    public isCorrect: boolean;
}

export class TestQuestionDto {

    @ApiProperty()
    @IsNumber()
    public id?: number;

    @ApiProperty()
    @IsNotEmpty()
    public body: string;

    @ApiProperty({ type: TestQuestionAnswerDto, isArray: true })
    @IsArray()
    @ArrayMinSize(2)
    public answers: TestQuestionAnswerDto[];
}


export class TestDto {

    @ApiProperty()
    public id?: number;

    @ApiProperty()
    @IsNotEmpty({ message: TestErrorsDto.InvalidTestTitle })
    public title: string;

    @ApiProperty()
    public createdAt?: number;

    @ApiProperty()
    public updatedAt?: number;

    @ApiProperty({ type: TestQuestionDto, isArray: true })
    @IsArray()
    @ArrayMinSize(1, { message: TestErrorsDto.TestMustContainQuestions })
    public questions: TestQuestionDto[];

}