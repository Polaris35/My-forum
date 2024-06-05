import { CreatePostDto, postsControllerCreatePost } from '@/shared/api';
import { POST } from '@/shared/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { headers } from 'next/headers';

export function UseCreatePostMutation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreatePostDto) => {
            console.log('Bearer ' + session?.user.accessToken);
            return postsControllerCreatePost(dto, {
                headers: {
                    Authorization: 'Bearer ' + session?.user.accessToken,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [POST.ALL] });
        },
    });
}
