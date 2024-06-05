import {
    Body,
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateCommentDto, CreatePostDto } from './dto';
import { CurrentUser, Public } from '@common/decorators';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostResponse } from './responses/post.response';
import { PostDataResponse } from './responses/post-data.response';

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

    @Public()
    @Get()
    @ApiResponse({
        type: PostDataResponse,
    })
    @ApiQuery({
        name: 'id',
        type: Number,
        required: true,
    })
    getPostById(@Query('id', ParseIntPipe) id: number) {
        console.log(id);
        return this.postService.getPostById(id);
    }

    @Post('comment')
    addComment(
        @Body() dto: CreateCommentDto,
        @CurrentUser('id') userId: number,
    ) {
        console.log(dto);
        return this.postService.addComment(dto, userId);
    }

    // @Public()
    // @Get('comments')
    // @ApiResponse({
    //     type: CommentResponse,
    //     isArray: true,
    // })
    // @ApiQuery({
    //     name: 'postId',
    //     type: Number,
    //     required: true,
    // })
    // getAllComments(@Query('postId', ParseIntPipe) postId: number) {
    //     return this.postService.getAllComments(postId);
    // }
}
