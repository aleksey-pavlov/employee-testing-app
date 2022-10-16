export class UserTestProgress {

    constructor(
        public totalQuestions: number,
        public completedQuestions: number,
        public correctAnswers: number,
    ) { }
}

export class UserTestDto {

    public id: number;
    public testId: number;
    public testTitle: string;
    public testProgress: UserTestProgress;
    public startedAt: number;
    public finisherAt: number;
    public questions: UsertTestQuestionDto[]
}

export class UsertTestQuestionDto {

    public questionId: number;
    public body: string;
    public answers: UserTestAnswerDto[]

}

export class UserTestAnswerDto {

    public answerId: number;
    public answeredAt: number;
    public body: string;
    public isSelected: boolean;
    public isCorrect: boolean;
}

export class UserTestPostAnswerDto {
    public answerId: number;
}

export class UserTestPostAnswerResponseDto {

    public questionId: number;
    public answers: UserTestAnswerDto[];
    public testProgress: UserTestProgress;

}


export class AnswerAlreadyPostedError extends Error {
    constructor() { super("AnswerByQuestionAlready"); }
}

export class UserTestAlreadyStarted extends Error {
    constructor() { super("UserTestAlreadyStarted"); }
}

export class UserTestIsFinished extends Error {
    constructor() { super("UserTestIsFinished"); }
}