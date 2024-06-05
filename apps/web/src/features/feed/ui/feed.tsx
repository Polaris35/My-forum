import { postsControllerGetAllPosts } from '@/shared/api';
import { UiSpinner } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { Post } from './post';
import { POST } from '@/shared/constants';
import { useRouter } from 'next/router';

type FeedProps = {
    subreddit?: string;
};
export function Feed({ subreddit }: FeedProps) {
    const router = useRouter();
    const query = useQuery({
        queryKey: [POST.ALL, subreddit],
        queryFn: () => postsControllerGetAllPosts({ subreddit }),
    });
    if (query.isLoading) {
        return (
            <div className="flex items-center justify-center">
                <UiSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 mt-4">
            {query.data?.map((post) => {
                return (
                    <div onClick={() => router.push(`/post/${post.id}`)}>
                        <Post
                            key={post.id}
                            userAvatar={post.creatorAvatar}
                            nickname={post.creatorUsername}
                            createdAt={post.createdAt}
                            title={post.title}
                            body={post.body}
                            imageId={post.imageId}
                            subredditTopic={post.subredditTopic}
                            votesCount={post.votesCount}
                            comentCount={post.commentsCount}
                        />
                    </div>
                );
            })}
        </div>
    );
}
