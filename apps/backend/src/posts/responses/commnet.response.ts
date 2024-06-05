import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    text: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    userAvatar: string;
    @ApiProperty()
    username: string;
}
