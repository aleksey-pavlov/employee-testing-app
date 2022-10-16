import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PositionDto, PositionUpdateDto } from './position.dto';
import { PositionEntity } from './position.entity';

@Injectable()
export class PositionsService {

    constructor(@InjectRepository(PositionEntity) private positionRepository: Repository<PositionEntity>) {

    }

    public async findAll(): Promise<PositionEntity[]> {

        return await this.positionRepository.find();
    }

    public async findOne(id: number): Promise<PositionDto> {

        return await this.positionRepository.findOne({ where: { id: id } });
    }

    public async findOneByTitle(title: string): Promise<PositionDto> {
        return await this.positionRepository.findOne({ where: { title: title } });
    }

    public async updateOne(id: number, data: PositionUpdateDto): Promise<BaseModifyResponseDto> {

        let position = await this.positionRepository.findOne({ where: { id: id } });

        if (!position)
            throw new EntityNotFoundError(PositionEntity, { id: id });

        position.title = data.title;

        return await this.positionRepository.save(position);
    }

    public async insertOne(data: PositionUpdateDto): Promise<BaseModifyResponseDto> {

        let position = new PositionEntity();
        position.title = data.title;
        return await this.positionRepository.save(position);
    }

    public async deleteOne(id: number): Promise<boolean> {

        let result = await this.positionRepository.delete(id);
        return result.affected > 0;
    }
}
