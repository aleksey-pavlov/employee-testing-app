import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TestDto, TestQuestionAnswerDto, TestQuestionDto, TestShortDto } from "./test.dto";

@Entity("TESTS")
export class TestEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'TITLE' })
    public title: string;

    @Column({ name: 'CREATEDAT' })
    public createdAt: number;

    @Column({ name: 'UPDATEDAT' })
    public updatedAt: number;

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = Date.now() / 1000;
    }

    @BeforeInsert()
    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = Date.now() / 1000;
    }

    @OneToMany(type => TestQuestionEntity, question => question.test, { cascade: true, onDelete: 'CASCADE' })
    public questions: TestQuestionEntity[];

    public toTestShortDto(): TestShortDto {

        let test = new TestShortDto();
        test.id = this.id;
        test.title = this.title;
        test.createAt = this.createdAt;
        test.updateAt = this.updatedAt;

        return test;
    }

    public toTestDto(): TestDto {

        let test = new TestDto();
        test.id = this.id;
        test.title = this.title;
        test.createdAt = this.createdAt;
        test.updatedAt = this.updatedAt;
        test.questions = this.questions?.map(q => q.toTestQuestionDto());

        return test;

    }

    public assign(data: TestDto) {
        this.id = data.id;
        this.title = data.title;
        this.questions = data.questions.map(q => new TestQuestionEntity().assign(q));
    }

}

@Entity('TEST_QUESTIONS')
export class TestQuestionEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'TEST_ID' })
    public testId: number;

    @Column({ name: 'BODY' })
    public body: string;

    @ManyToOne(type => TestEntity, test => test.questions)
    @JoinColumn({ name: "TEST_ID" })
    public test: TestEntity;

    @OneToMany(type => TestQuestionAnswerEntity, answer => answer.question, { cascade: true, onDelete: 'CASCADE' })
    public answers: TestQuestionAnswerEntity[];

    public toTestQuestionDto(): TestQuestionDto {

        let test = new TestQuestionDto();
        test.id = this.id;
        test.body = this.body;
        test.answers = this.answers?.map(a => a.toTestQuestionAnswerDto());

        return test;
    }

    public assign(data: TestQuestionDto) {

        this.id = data.id;
        this.body = data.body;
        this.answers = data.answers.map(a => new TestQuestionAnswerEntity().assign(a));

        return this;
    }
}

@Entity("TEST_QUESTION_ANSWERS")
export class TestQuestionAnswerEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'QUESTION_ID' })
    public questionId: number;

    @Column({ name: 'BODY' })
    public body: string;

    @Column({ name: 'ISCORRECT' })
    public isCorrect: boolean;

    @ManyToOne(type => TestQuestionEntity, question => question.answers)
    @JoinColumn({ name: "QUESTION_ID" })
    public question: TestQuestionEntity;

    public toTestQuestionAnswerDto() {

        let test = new TestQuestionAnswerDto();
        test.id = this.id;
        test.body = this.body;
        test.isCorrect = this.isCorrect;

        return test;
    }

    public assign(data: TestQuestionAnswerDto) {

        this.id = data.id;
        this.body = data.body;
        this.isCorrect = data.isCorrect;

        return this;
    }
}