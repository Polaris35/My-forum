import { UpvoteDto, postsControllerUpvote } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function UseUpvoteMutation() {
    const { data: session } = useSession();
    return useMutation({
        mutationFn: (dto: UpvoteDto) =>
            postsControllerUpvote(dto, {
                headers: {
                    Authorization: 'Bearer ' + session?.user.accessToken,
                },
            }),
    });
}
