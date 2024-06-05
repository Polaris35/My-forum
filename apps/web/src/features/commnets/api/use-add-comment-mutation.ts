import { CreateCommentDto, postsControllerAddComment } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function UseAddCommentMutation(postId: number) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateCommentDto) =>
            postsControllerAddComment(dto, {
                headers: {
                    Authorization: 'Bearer ' + session?.user.accessToken,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commnets', postId] });
        },
    });
}
