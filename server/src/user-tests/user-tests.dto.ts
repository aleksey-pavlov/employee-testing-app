import { ApiProperty, ApiResponse } from "@nestjs/swagger";

export class UserTestProgress {

    @ApiProperty()
    public totalQuestions: number;

    @ApiProperty()
    public completedQuestions: number;

    @ApiProperty()
    public correctAnswers: number;

    constructor(
        totalQuestions: number,
        completedQuestions: number,
        correctAnswers: number,
    ) { 
        this.totalQuestions = totalQuestions;
        this.completedQuestions = completedQuestions;
        this.correctAnswers = correctAnswers;
    }
}

export class UserTestDto {

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public testId: number;

    @ApiProperty()
    public testTitle: string;

    @ApiProperty()
    public testProgress: UserTestProgress;

    @ApiProperty()
    public startedAt: number;

    @ApiProperty()
    public finisherAt: number;

    @ApiProperty()
    public questions: UsertTestQuestionDto[]
}

export class UsertTestQuestionDto {

    @ApiProperty()
    public questionId: number;

    @ApiProperty()
    public body: string;

    @ApiProperty()
    public answers: UserTestAnswerDto[]

    @ApiProperty()
    public isAnswered: boolean;

}

export class UserTestAnswerDto {

    @ApiProperty()
    public answerId: number;

    @ApiProperty()
    public answeredAt: number;

    @ApiProperty()
    public body: string;

    @ApiProperty()
    public isSelected: boolean;

    @ApiProperty()
    public isCorrect: boolean;
}

export class UserTestPostAnswerDto {

    @ApiProperty()
    public answerId: number;
}

export class UserTestPostAnswerResponseDto {

    @ApiProperty()
    public questionId: number;

    @ApiProperty()
    public answers: UserTestAnswerDto[];

    @ApiProperty()
    public testProgress: UserTestProgress;

}


export class AnswerAlreadyPostError extends Error {
    constructor() { super("AnswerByQuestionAlready"); }
}

export class UserTestIsFinished extends Error {
    constructor() { super("UserTestIsFinished"); }
}