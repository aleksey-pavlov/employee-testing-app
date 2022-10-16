import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseModifyResponseDto } from 'src/base/base.dto';
import { EntityNotFoundError, Repository, TypeORMError } from 'typeorm';
import { RoleDto, RoleUpdateDto } from './role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>) {
    }

    public async findAll(): Promise<RoleDto[]> {

        return await this.roleRepository.find();
    }

    public async findOne(id: number): Promise<RoleDto> {

        return await this.roleRepository.findOne({ where: { id: id } });
    }

    public async findOneByName(name: string): Promise<RoleDto> {

        return await this.roleRepository.findOne({ where: { name: name } });
    }

    public async updateOne(id: number, data: RoleUpdateDto): Promise<BaseModifyResponseDto> {

        let role = await this.roleRepository.findOne({ where: { id: id } });

        if (!role)
            throw new EntityNotFoundError(RoleEntity, { id: id });

        role.name = data.name;

        return await this.roleRepository.save(role);
    }

    public async insertOne(data: RoleUpdateDto): Promise<BaseModifyResponseDto> {

        let role = new RoleEntity();
        role.name = data.name;
        return await this.roleRepository.save(role);
    }

    public async deleteOne(id: number): Promise<boolean> {

        let result = await this.roleRepository.delete({ id: id });

        return result.affected > 0;
    }
}
