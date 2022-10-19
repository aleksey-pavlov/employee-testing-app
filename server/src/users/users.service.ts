import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserDto, UserUpdateDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) { }

    public async findAll(): Promise<UserDto[]> {

        let users = await this.usersRepository.find({
            relations: {
                role: true,
                position: true
            }
        })

        return users.map(v => v.toUserDto());
    }

    public async findById(id: number): Promise<UserDto> {

        let user = await this.usersRepository.findOne({
            where: { id: id },
            relations: { position: true, role: true }
        });

        return user.toUserDto();
    }

    public async findByLogin(login: string): Promise<UserEntity> {

        let user = await this.usersRepository.findOne({
            where: { login: login },
            relations: { role: true }
        });

        return user;
    }

    public async updateLasLoginDate(id: number): Promise<boolean> {

        let result = await this.usersRepository.update({ id: id }, { lastLoginAt: Date.now() / 1000 });

        return result.affected > 0
    }

    public async updateOne(id: number, data: UserUpdateDto): Promise<UserDto> {

        let user = await this.usersRepository.findOne({ where: { id: id } });
        if (!user)
            throw new EntityNotFoundError(UserEntity, { id: id });

        user.assign(data);

        let updated = await this.usersRepository.save(user);

        return updated?.toUserDto();
    }

    public async insertOne(data: UserUpdateDto): Promise<UserDto> {

        let user = new UserEntity();
        user.assign(data);

        let inserted = await this.usersRepository.save(user);

        return inserted?.toUserDto();
    }

    public async deleteOne(id: number): Promise<boolean> {

        let result = await this.usersRepository.delete(id);
        return result.affected > 0;
    }
}
