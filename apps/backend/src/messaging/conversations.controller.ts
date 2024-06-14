import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUser } from '@common/decorators';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtPayload } from '@auth/interfaces';
import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
} from './responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageLoader } from '@common/utils';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messagesService: MessagesService,
    ) {}

    @Post('private')
    @ApiOkResponse({
        type: ConversationPreviewResponse,
    })
    @ApiBody({
        schema: {
            properties: { userId: { type: 'number' } },
        },
    })
    async createPrivateConversation(
        @CurrentUser() currentUser: JwtPayload,
        @Body('userId') userId: number,
    ): Promise<ConversationPreviewResponse> {
        console.log('userId: ', userId);
        console.log('currentUser: ', currentUser.id);
        const conversation =
            await this.conversationsService.createPrivateConversation(
                currentUser.id,
                userId,
            );

        return this.conversationsService.getPrivateConversationPreview(
            conversation.id,
            userId,
        );
    }

    @Post('group')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiOkResponse({
        type: ConversationPreviewResponse,
    })
    @UseInterceptors(FileInterceptor('image', ImageLoader))
    async createGroupConversation(
        @CurrentUser('id') currentUser: number,
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
    ): Promise<ConversationPreviewResponse> {
        const conversation = await this.conversationsService.createGroup(
            title,
            file,
            currentUser,
        );
        return this.conversationsService.getGroupConversationPreview(
            conversation.id,
            currentUser,
        );
    }

    @ApiOkResponse({
        type: ConversationPreviewListResponse,
    })
    @Get('list')
    async conversationPreviewList(@CurrentUser('id') userId: number) {
        const conversationsList =
            await this.conversationsService.getUserConversations(userId);

        return conversationsList;
    }

    @Delete(':id')
    deleteConversation(
        @CurrentUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conversationsService.deleteConversation(id, userId);
    }
}
