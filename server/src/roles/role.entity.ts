import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleDto } from "./role.dto";


@Entity("ROLES")
export class RoleEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'NAME', unique: true })
    public name: string;
}