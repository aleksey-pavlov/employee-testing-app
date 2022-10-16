import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from "class-validator";

export enum TestErrorsDto {
    InvalidTestTitle = "InvalidTestTitle",
    TestMustContainQuestions = "TestMustContainQuestions"
}

export class TestShortDto {

    public id: number;
    public title: string;
    public createAt: number;
    public updateAt: number;
}

export class TestQuestionAnswerDto {

    @IsNumber()
    public id?: number;

    @ApiProperty()
    @IsNotEmpty()
    public body: string;

    @ApiProperty()
    public isCorrect: boolean;
}

export class TestQuestionDto {

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

    public id?: number;

    @ApiProperty()
    @IsNotEmpty({ message: TestErrorsDto.InvalidTestTitle })
    public title: string;

    public createdAt?: number;
    public updatedAt?: number;

    @ApiProperty({ type: TestQuestionDto, isArray: true })
    @IsArray()
    @ArrayMinSize(1, { message: TestErrorsDto.TestMustContainQuestions })
    public questions: TestQuestionDto[];

}