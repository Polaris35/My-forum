import {
    CurrentConversationContext,
    MessageActionKind,
} from '@/entities/current-conversation';
import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
    MessageResponse,
} from '@/shared/api';
import { CONVERSATION } from '@/shared/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

export function SocketInitializer() {
    const socketRef = useRef<Socket>();
    const session = useSession();
    const queryClient = useQueryClient();
    const { conversationId, dispatchMessages } = useContext(
        CurrentConversationContext,
    );
    useEffect(() => {
        if (session.status !== 'authenticated') {
            return;
        }
        socketRef.current = io('localhost:3000/events', {
            extraHeaders: {
                Authorization: 'Bearer ' + session.data.user.accessToken,
            },
        });

        socketRef.current.on(
            'new-conversation',
            (data: ConversationPreviewResponse) => {
                console.log('new-conversation', JSON.stringify(data));
                // queryClient.invalidateQueries({ queryKey: [CONVERSATION.LIST] });
                const list =
                    queryClient.getQueryData<ConversationPreviewListResponse>([
                        CONVERSATION.LIST,
                    ]);

                if (
                    hasObjectWithFieldValue(list?.conversations!, 'id', data.id)
                ) {
                    return;
                }
                queryClient.setQueriesData<ConversationPreviewListResponse>(
                    { queryKey: [CONVERSATION.LIST] },
                    (oldList) => {
                        return {
                            conversations: oldList
                                ? [...oldList.conversations, data]
                                : [data],
                        };
                    },
                );
            },
        );
        socketRef.current.on(
            'delete-conversation',
            (conversationId: number) => {
                console.log('delete-conversation', conversationId);
                // queryClient.invalidateQueries({ queryKey: [CONVERSATION.LIST] });

                // queryClient.setQueriesData<ConversationPreviewListResponse>(
                //     { queryKey: [CONVERSATION.LIST] },
                //     (oldList) => {
                //         return {
                //             conversations: oldList
                //                 ? oldList?.conversations.filter(
                //                       (conversation) =>
                //                           conversation.id === conversationId,
                //                   )
                //                 : [],
                //         };
                //     },
                // );
            },
        );
        socketRef.current.on('new-message', (data: MessageResponse) => {
            console.log('new-message in conversationId: ', conversationId);

            if (data.conversationId === conversationId) {
                console.log('new-message', data);
                dispatchMessages({
                    type: MessageActionKind.ADD,
                    payload: [{ ...data, status: 'sended' }],
                });
            }

            queryClient.setQueriesData<ConversationPreviewListResponse>(
                { queryKey: [CONVERSATION.LIST] },
                (oldList) => {
                    const conversations =
                        oldList?.conversations.map((conversation) => {
                            if (conversationId === conversation.id) {
                                return {
                                    ...conversation,
                                    message: data.message,
                                    senderName: data.senderName,
                                    time: data.createdAt,
                                    messageType: 'standalone_message',
                                };
                            }
                            return conversation;
                        }) || [];
                    return {
                        conversations: conversations,
                    };
                },
            );
        });
        socketRef.current.on('delete-message', (data: any) => {
            console.log('delete-message', data);
        });
        return () => {
            socketRef.current?.disconnect();
        };
    }, [session.status, conversationId]);
}

function hasObjectWithFieldValue(arr: any[], field: string, value: any) {
    return arr.some((obj) => obj[field] === value);
}
