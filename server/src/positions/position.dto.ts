import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export enum PositionErrorsDto
{
    InvalidPositionTitle = "InvalidPositionTitle",
    PositionAlreadyExists = "PositionAlreadyExists"
}


export class PositionDto
{
    @ApiProperty()
    public id?: number;

    @ApiProperty()
    public title: string;
}

export class PositionUpdateDto
{
    @ApiProperty()
    @IsNotEmpty({message: PositionErrorsDto.InvalidPositionTitle})
    public title: string;
}