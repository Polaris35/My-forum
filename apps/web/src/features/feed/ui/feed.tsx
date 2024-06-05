import { postsControllerGetAllPosts } from '@/shared/api';
import { UiSpinner } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { Post } from './post';
import { POST } from '@/shared/constants';

export function Feed() {
    const query = useQuery({
        queryKey: [POST.ALL],
        queryFn: postsControllerGetAllPosts,
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
                );
            })}
        </div>
    );
}
