import { ApiProperty } from '@nestjs/swagger';

export class PostResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    title: string;
    @ApiProperty()
    body: string;
    @ApiProperty()
    imageId: number;
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    subredditId: number;
    @ApiProperty()
    subredditTopic: string;
    @ApiProperty()
    votesCount: number;
    @ApiProperty()
    commentsCount: number;

    @ApiProperty()
    creatorAvatar: string;
    @ApiProperty()
    creatorUsername: string;
}
