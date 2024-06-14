import { ApiProperty } from '@nestjs/swagger';
import {
    Conversation,
    ConversationType,
    ParticipantRole,
} from '@prisma/client';

export class ParticipantResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    role: ParticipantRole;
}

export class ConversationResponse implements Conversation {
    @ApiProperty()
    id: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    title: string;
    @ApiProperty()
    creatorId: number;
    @ApiProperty()
    avatarIds: number[];
    @ApiProperty()
    type: ConversationType;
    @ApiProperty()
    participants: ParticipantResponse[];
    constructor(conversation: ConversationResponse) {
        Object.assign(this, conversation);
    }
}
