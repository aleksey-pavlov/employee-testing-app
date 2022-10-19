import { ApiProperty } from "@nestjs/swagger";

export class BaseModifyResponseDto 
{
    @ApiProperty()
    public id: number;

    constructor(id: number) {
        this.id = id;
    }
}