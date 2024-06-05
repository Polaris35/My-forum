import { SendCommentForm } from '@/features/commnets';
import { Post } from '@/features/feed';
import { postsControllerGetPostById } from '@/shared/api';
import { UiAvatar, UiSpinner } from '@/shared/ui';
import { HomePageHeader } from '@/widgets/home-page-header';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Timeago from 'react-timeago';

export function PostPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const query = useQuery({
        queryKey: ['post', router.query.postId],
        queryFn: () =>
            postsControllerGetPostById({
                id: Number(router.query.postId!),
            }),
    });

    return (
        <div className="h-screen overflow-y-scroll bg-base-200">
            <HomePageHeader />
            {query.isLoading && (
                <div className="flex items-center justify-center bg-base-200 h-full z-50">
                    <UiSpinner />
                </div>
            )}
            {/* Page content */}
            <div className="my-7 max-w-5xl mx-auto">
                <Post
                    className="hover:border-neutral cursor-default"
                    userAvatar={''}
                    nickname={query.data?.creatorUsername!}
                    createdAt={query.data?.createdAt!}
                    title={query.data?.title!}
                    body={query.data?.body!}
                    imageId={query.data?.imageId!}
                    subredditTopic={query.data?.subredditTopic!}
                    votesCount={query.data?.votesCount!}
                    comentCount={query.data?.commentsCount!}
                />
                <div className="-mt-1 rounded-b-md border  border-t-0 border-neutral bg-base-100 p-5 pl-16">
                    <p className="text-sm">
                        Comment as{' '}
                        <span className="text-accent">
                            {session?.user.name}
                        </span>
                    </p>

                    <SendCommentForm
                        postId={Number(router.query.postId!)}
                        onNewComment={() => query.refetch()}
                    />
                </div>
                <div className="-my-5 rounded-b-md border border-t-0 border-neutral bg-base-100 py-5 px-10">
                    <div className="divider"></div>
                    <div className="flex flex-col gap-3">
                        {query.data?.comments.map((comment) => (
                            <div
                                className="relative flex items-center space-x-2"
                                key={comment.id}
                            >
                                {/* <div className="divider"></div> */}
                                <UiAvatar
                                    url={comment.userAvatar}
                                    size={'small'}
                                />
                                <div className="">
                                    <p className="py-2 text-xs text-gray-400">
                                        <span className="font-semibold">
                                            {comment.username}{' '}
                                            <Timeago date={comment.createdAt} />
                                        </span>
                                    </p>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
