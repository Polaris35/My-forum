import { postsControllerGetVotes } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export function UseUpvoteQuery(postId: number) {
    return useQuery({
        queryKey: ['upvotes', postId],
        queryFn: () => postsControllerGetVotes({ postId }),
    });
}
