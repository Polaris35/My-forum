import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty()
    comment: string;
    @ApiProperty()
    postId: number;
}
