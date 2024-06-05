import { ApiProperty } from '@nestjs/swagger';

export class UpvoteDto {
    @ApiProperty()
    postId: number;
    @ApiProperty()
    vote: boolean;
}
