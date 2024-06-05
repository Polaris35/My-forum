import { ApiProperty } from '@nestjs/swagger';

export class UpvoteResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    userId: number;
    @ApiProperty()
    vote: boolean;
}
