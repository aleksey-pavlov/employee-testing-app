import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "./role.dto";

@Entity("ROLES")
export class RoleEntity {

    @PrimaryGeneratedColumn({ name: 'ID' })
    public id: number;

    @Column({ name: 'NAME', unique: true, enum: RolesEnum })
    public name: RolesEnum;
}