import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto';
import { CurrentUser, Public } from '@common/decorators';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostResponse } from './responses/post.response';

@Controller('post')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Post()
    createPost(@Body() dto: CreatePostDto, @CurrentUser('id') id: number) {
        return this.postService.create(dto, id);
    }

    @Public()
    @Get('all')
    @ApiResponse({
        type: PostResponse,
        isArray: true,
    })
    @ApiQuery({
        name: 'subreddit',
        type: String,
        required: false,
    })
    getAllPosts(@Query('subreddit') subreddit?: string) {
        console.log(subreddit);
        return this.postService.getAllPosts(subreddit);
    }
}
