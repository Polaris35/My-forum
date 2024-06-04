import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto';
import { CurrentUser } from '@common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Post()
    createPost(@Body() dto: CreatePostDto, @CurrentUser('id') id: number) {
        return this.postService.create(dto, id);
    }
}
