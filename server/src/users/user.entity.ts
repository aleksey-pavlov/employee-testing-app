import { AuthHelper } from 'src/auth/auth.helper';
import { PositionEntity } from 'src/positions/position.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto, UserUpdateDto } from './user.dto';

@Entity('USERS')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'NAME' })
    public name: string;

    @Column({ name: 'LOGIN', unique: true })
    public login: string;

    @Column({ name: 'PASSWORD' })
    public password: string;

    @Column({ name: 'ROLE_ID' })
    public roleId: number;

    @Column({ name: 'POSITION_ID' })
    public positionId: number;

    @Column({ name: "CREATEDAT" })
    public createdAt: number;

    @Column({ name: "UPDATEDAT" })
    public updatedAt: number;

    @Column({ name: "LASTLOGINAT" })
    public lastLoginAt: number;

    @ManyToOne(type => RoleEntity)
    @JoinColumn({ name: 'ROLE_ID' })
    public role: RoleEntity;

    @ManyToOne(type => PositionEntity)
    @JoinColumn({ name: 'POSITION_ID' })
    public position: PositionEntity;

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = Date.now() / 1000;
    }

    @BeforeInsert()
    @BeforeUpdate()
    setUpdateAt() {
        this.updatedAt = Date.now() / 1000;
    }

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password)
            this.password = AuthHelper.hasPassword(this.password);
    }

    public toUserDto(): UserDto {

        let user = new UserDto();
        user.id = this.id;
        user.name = this.name;
        user.login = this.login;
        user.role = this.role?.name;
        user.roleId = this.roleId;
        user.position = this.position?.title;
        user.positionId = this.positionId;
        user.createdAt = this.createdAt;
        user.updatedAt = this.updatedAt;
        user.lastLoginAt = this.lastLoginAt;

        return user;
    }

    public assign(data: UserUpdateDto) {

        this.name = data.name;
        this.login = data.login;
        if (data.password)
            this.password = data.password;
        this.roleId = data.roleId;
        this.positionId = data.positionId;
    }

}