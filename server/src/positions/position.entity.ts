import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("POSITIONS")
export class PositionEntity {

    @PrimaryGeneratedColumn({name: 'ID'})
    public id: number;

    @Column({name: 'TITLE', unique: true})
    public title: string;
}