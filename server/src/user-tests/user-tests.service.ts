import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEntity, TestQuestionAnswerEntity, TestQuestionEntity } from 'src/tests/test.entity';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { AnswerAlreadyPostError, UserTestDto, UserTestPostAnswerDto, UserTestPostAnswerResponseDto } from './user-tests.dto';
import { UserTestAnswerEntity, UserTestEntity, UserTestEntityExtensions } from './user-tests.entity';

@Injectable()
export class UserTestsService {

    constructor(
        @InjectRepository(UserTestEntity) private userTestRepository: Repository<UserTestEntity>,
        @InjectRepository(TestEntity) private testRepository: Repository<TestEntity>,
        @InjectRepository(TestQuestionAnswerEntity) private testAnswerRepository: Repository<TestQuestionAnswerEntity>,
        @InjectRepository(TestQuestionEntity) private testQuestionRepository: Repository<TestQuestionEntity>,
        @InjectRepository(UserTestAnswerEntity) private userTestAnswerRepository: Repository<UserTestAnswerEntity>,
        private dataSource: DataSource
    ) { }

    public async findAll(userId: number): Promise<UserTestDto[]> {

        let tests = await this.userTestRepository.find(
            {
                where: { userId: userId },
                relations: { test: { questions: true } }
            });

        return tests.map(t => t.toUserTestDto());
    }

    public async findOne(userTestId: number): Promise<UserTestDto> {

        let test = await this.userTestRepository.findOne(
            {
                where: {
                    id: userTestId,
                },
                relations: {
                    test: {
                        questions: {
                            answers: true
                        }
                    },
                    userAnswers: true
                }
            });

        if (!test)
            throw new EntityNotFoundError(UserTestEntity, { id: userTestId });


        return test.toUserTestDto();
    }

    public async startTest(userId: number, testId: number): Promise<UserTestDto> {

        let test = await this.testRepository.findOne({
            where: { id: testId }
        });

        if (!test)
            throw new EntityNotFoundError(TestEntity, { id: testId })

        let startedTest = await this.userTestRepository.findOne({
            where: {
                userId: userId,
                testId: testId
            }
        });

        if (startedTest)
            return await this.findOne(startedTest.id);

        let userTest = new UserTestEntity();
        userTest.testId = test.id;
        userTest.userId = userId;

        let inserted = await this.userTestRepository.insert(userTest);

        return await this.findOne(inserted.raw.ID);
    }

    public async commitAnswer(userTestId: number, questionId: number, data: UserTestPostAnswerDto): Promise<UserTestPostAnswerResponseDto> {

        let userTest = await this.userTestRepository.findOne(
            {
                where: { id: userTestId },
                relations: { test: { questions: true } }
            });

        if (!userTest)
            throw new EntityNotFoundError(UserTestEntity, { id: userTestId });

        let existsAnswers = await this.userTestAnswerRepository.findOne(
            { where: { userTestId: userTest.id, questionId: questionId } }
        );

        if (existsAnswers)
            throw new AnswerAlreadyPostError();

        let answer = await this.testAnswerRepository.findOne({ where: { id: data.answerId } });

        if (!answer)
            throw new EntityNotFoundError(TestQuestionAnswerEntity, { id: data.answerId });

        let userAnswer = new UserTestAnswerEntity();
        userAnswer.answerId = data.answerId;
        userAnswer.questionId = questionId;
        userAnswer.userTestId = userTestId;

        userTest.completedQuestions++;
        if (answer.isCorrect)
            userTest.correctAnswers++;

        await this.dataSource.transaction('READ COMMITTED', async (manager) => {
            let result = await manager.insert(UserTestAnswerEntity, userAnswer);
            userAnswer.id = result.raw.ID;
            await manager.update(UserTestEntity, { id: userTestId }, {
                completedQuestions: userTest.completedQuestions,
                correctAnswers: userTest.correctAnswers
            });
        });

        let testQuestion = await this.testQuestionRepository.findOne({
            where: { id: questionId },
            relations: { answers: true }
        });

        let response = new UserTestPostAnswerResponseDto();
        response.questionId = questionId;
        response.testProgress = userTest.toUserTestProgressDto();
        response.answers = UserTestEntityExtensions.toUserTestAnswersDto(
            testQuestion.answers,
            { [userAnswer.answerId]: userAnswer });

        return response;
    }

    public async finishTest(userTestId: number) {

        let startedTest = await this.userTestRepository.findOne({
            where: {
                id: userTestId
            }
        });

        if (startedTest.finishedAt)
            return;

        startedTest.finishedAt = Date.now() / 1000;

        await this.userTestRepository.save(startedTest);
    }

    public async removeTest(userTestId: number): Promise<boolean> {
        let result = await this.userTestRepository.delete(userTestId);
        return result.affected > 0;
    }
}
