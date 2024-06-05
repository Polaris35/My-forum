import { ApiProperty } from '@nestjs/swagger';
import { CommentResponse } from './commnet.response';
import { PostResponse } from './post.response';

export class PostDataResponse extends PostResponse {
    @ApiProperty({
        isArray: true,
        type: CommentResponse,
    })
    comments: CommentResponse[];
}
