import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { TestDto, TestShortDto } from './test.dto';
import { TestEntity } from './test.entity';

@Injectable()
export class TestsService {

    constructor(@InjectRepository(TestEntity) private testRepository: Repository<TestEntity>) { }


    public async findAll(): Promise<TestShortDto[]> {

        let tests = await this.testRepository.find();
        return tests?.map(t => t.toTestShortDto());
    }

    public async findOne(id: number): Promise<TestDto> {

        let test = await this.testRepository.findOne({
            where: { id: id }, relations: {
                questions: {
                    answers: true
                }
            }
        });

        return test.toTestDto();
    }

    public async insertOne(data: TestDto): Promise<TestDto> {

        let test = new TestEntity()
        test.assign(data);

        let inserted = await this.testRepository.save(test);

        return inserted.toTestDto();
    }

    public async updateOne(id: number, data: TestDto): Promise<TestDto> {

        let test = await this.testRepository.findOne({
            where: { id: id }, relations: {
                questions: {
                    answers: true
                }
            }
        });

        if (!test)
            throw new EntityNotFoundError(TestEntity, { id: id });

        test.assign(data);

        return await this.testRepository.save(test);
    }

    public async deleteOne(id: number): Promise<boolean> {

        let result = await this.testRepository.delete(id);
        return result.affected > 0;
    }
}
