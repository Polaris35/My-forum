import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreatePostDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    @IsOptional()
    body: string | null;
    @ApiProperty()
    subreddit: string;
    @ApiProperty()
    @IsOptional()
    imageId: number | null;
}
