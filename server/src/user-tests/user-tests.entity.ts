import { TestEntity, TestQuestionAnswerEntity, TestQuestionEntity } from "src/tests/test.entity";
import { UserEntity } from "src/users/user.entity";
import { AfterLoad, BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationCount } from "typeorm";
import { RelationCountAttribute } from "typeorm/query-builder/relation-count/RelationCountAttribute";
import { UserTestDto, UserTestProgress, UserTestAnswerDto, UsertTestQuestionDto } from "./user-tests.dto";


export type UserAnswersByAnswerId = { [aid: number]: UserTestAnswerEntity }
export type UserAnswersDict = { [qid: number]: UserAnswersByAnswerId }

@Entity('USERTESTS')
export class UserTestEntity extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'TEST_ID' })
    public testId: number;

    @Column({ name: 'USER_ID' })
    public userId: number;

    @Column({ name: 'STARTEDAT' })
    public startedAt: number;

    @Column({ name: 'FINISHEDAT' })
    public finishedAt: number;

    @Column({ name: 'COMPLETED_QUESTIONS' })
    public completedQuestions: number;

    @Column({ name: 'CORRECT_ANSWERS' })
    public correctAnswers: number;

    @ManyToOne(type => UserEntity)
    @JoinColumn({ name: 'USER_ID' })
    public user: UserEntity;

    @ManyToOne(type => TestEntity)
    @JoinColumn({ name: 'TEST_ID' })
    public test: TestEntity;

    @OneToMany(type => UserTestAnswerEntity, answer => answer.userTest)
    public userAnswers: UserTestAnswerEntity[]

    @BeforeInsert()
    setStartedAt() {
        this.startedAt = Date.now() / 1000;
    }

    private userAnswersDict: UserAnswersDict;

    public getUserAnswersDict(): UserAnswersDict {

        if (this.userAnswersDict)
            return this.userAnswersDict;

        this.userAnswersDict = {};

        for (let i in this.userAnswers) {

            let answer = this.userAnswers[i];

            if (!this.userAnswersDict[answer.questionId])
                this.userAnswersDict[answer.questionId] = {}


            this.userAnswersDict[answer.questionId][answer.answerId] = answer;
        }

        return this.userAnswersDict;
    }

    public toUserTestDto(): UserTestDto {

        let test = new UserTestDto();
        test.id = this.id;
        test.testId = this.testId;
        test.startedAt = this.startedAt;
        test.finisherAt = this.finishedAt;
        test.testTitle = this.test?.title;
        test.testProgress = new UserTestProgress(
            this.test?.questions.length,
            this.completedQuestions,
            this.correctAnswers)

        if (this.test) {
            let userAnswers = this.getUserAnswersDict()
            test.questions = UserTestEntityExtensions.toUserTestQuestionsDto(userAnswers, this.test?.questions);
        }

        return test;
    }

    public toUserTestProgressDto(): UserTestProgress {
        return new UserTestProgress(this.test.questions?.length, this.completedQuestions, this.correctAnswers);
    }
}

@Entity('USERTEST_ANSWERS')
export class UserTestAnswerEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'USERTEST_ID' })
    public userTestId: number;

    @Column({ name: 'ANSWER_ID' })
    public answerId: number;

    @Column({ name: 'QUESTION_ID' })
    public questionId: number;

    @Column({ name: "ANSWEREDAT" })
    public answeredAt: number;

    @OneToOne(type => TestQuestionAnswerEntity)
    @JoinColumn({ name: 'ANSWER_ID' })
    public answer: TestQuestionAnswerEntity;

    @OneToOne(type => TestQuestionEntity)
    @JoinColumn({ name: 'QUESTION_ID' })
    public question: TestQuestionEntity;

    @ManyToOne(type => UserTestEntity, userTest => userTest.userAnswers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'USERTEST_ID' })
    public userTest: UserTestEntity

    @BeforeInsert()
    setAnsweredAt() {
        this.answeredAt = Date.now() / 1000;
    }

}

export class UserTestEntityExtensions {

    public static toUserTestQuestionsDto(userAnswers: UserAnswersDict, testQuestions: TestQuestionEntity[]): UsertTestQuestionDto[] {

        let questions = [];

        if (!testQuestions)
            return questions;

        for (let idxQ in testQuestions) {

            let question = testQuestions[idxQ];

            let questionDto = new UsertTestQuestionDto();
            questionDto.body = question.body;
            questionDto.questionId = question.id;
            questionDto.answers = UserTestEntityExtensions.toUserTestAnswersDto(question.answers, userAnswers[question.id]);
            questionDto.isAnswered = !!userAnswers[question.id];

            questions.push(questionDto);
        }

        return questions;
    }

    public static toUserTestAnswersDto(answers: TestQuestionAnswerEntity[], userAnswers: UserAnswersByAnswerId): UserTestAnswerDto[] {

        let answersDto = [];

        for (let idxA in answers) {
            let answer = answers[idxA];
            let answerDto = new UserTestAnswerDto();
            answerDto.answerId = answer.id;
            answerDto.body = answer.body;

            if (userAnswers)
                answerDto.isCorrect = answer.isCorrect;

            let userAnswer = userAnswers ? userAnswers[answer.id] : undefined;
            if (userAnswer) {
                answerDto.answeredAt = userAnswer.answeredAt;
                answerDto.isSelected = true;
            }

            answersDto.push(answerDto);
        }

        return answersDto;
    }

}