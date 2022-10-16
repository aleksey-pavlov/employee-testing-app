import { TestEntity, TestQuestionAnswerEntity, TestQuestionEntity } from "src/tests/test.entity";
import { UserEntity } from "src/users/user.entity";
import { AfterLoad, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserTestDto, UserTestProgress, UserTestAnswerDto, UsertTestQuestionDto } from "./user-tests.dto";

export type UserTestAnswersEntityById = { [aid: number]: UserTestAnswerEntity }

@Entity('USERTESTS')
export class UserTestEntity {

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

    private userAnswersById: UserTestAnswersEntityById;

    public getAnswerById(answerId: number): UserTestAnswerEntity {

        if (this.userAnswersById)
            return this.userAnswersById[answerId];

        this.userAnswersById = {};

        for (let i in this.userAnswers)
        {
            let answer = this.userAnswers[i];
            this.userAnswersById[answer.answerId] = answer; 
        }

        return this.userAnswersById[answerId];
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

        if (this.test)
            test.questions = this.toUserTestQuestionsDto();

        return test;
    }

    public toUserTestQuestionsDto(): UsertTestQuestionDto[] {
        
        let questions = [];

        for (let idxQ in this.test?.questions) {

            let question = this.test.questions[idxQ];

            let questionDto = new UsertTestQuestionDto();
            questionDto.body = question.body;
            questionDto.questionId = question.id;
            questionDto.answers = this.toUserTestAnswersDto(question.answers);

            questions.push(questionDto);
        }

        return questions;
    }

    public toUserTestAnswersDto(answers: TestQuestionAnswerEntity[]): UserTestAnswerDto[] {

        let answersDto = [];

        for (let idxA in answers) {
            let answer = answers[idxA];
            let answerDto = new UserTestAnswerDto();
            answerDto.answerId = answer.id;
            answerDto.body = answer.body;
            answerDto.isCorrect = answer.isCorrect;
            
            let userAnswer = this.getAnswerById(answer.id);
            if ( userAnswer ) {
                answerDto.answeredAt = userAnswer.answeredAt;
                answerDto.isSelected = true;
            }

            answersDto.push(answerDto);
        }

        return answersDto;
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

    @ManyToOne(type => UserTestEntity, userTest => userTest.userAnswers, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'USERTEST_ID'})
    public userTest: UserTestEntity

    @BeforeInsert()
    setAnsweredAt() {
        this.answeredAt = Date.now() / 1000;
    }

    public toUserTestQuestionAnswerDto() {

        let answer = new UserTestAnswerDto();
        answer.answerId = this.answerId;
        answer.answeredAt = this.answeredAt;
        answer.body = this.answer.body;
        answer.isCorrect = this.answer.isCorrect;
        answer.isSelected = true;

        return answer;
    }
}