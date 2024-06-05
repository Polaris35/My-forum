import { UiAvatar, UiSpinner } from '@/shared/ui';
import { getAttachmentUrl, getFullUrl } from '@/shared/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { BsChat } from 'react-icons/bs';
import { FaArrowDown, FaArrowUp, FaRegBookmark } from 'react-icons/fa6';
import { GoShareAndroid } from 'react-icons/go';
import { RxDotsHorizontal } from 'react-icons/rx';
import TimeAgo from 'react-timeago';
import { UseUpvoteQuery } from '../api/use-upvote-query';
import { UseUpvoteMutation } from '../api/use-upvote-mutation';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { UpvoteResponse } from '@/shared/api';

type PostProps = {
    id: number;
    userAvatar: string;
    nickname: string;
    createdAt: string;
    title: string;
    body: string;
    imageId: number | null;
    subredditTopic: string;
    votesCount: number;
    comentCount: number;
    className?: string;
};
export function Post({
    id,
    userAvatar,
    nickname,
    createdAt,
    title,
    body,
    imageId,
    comentCount,
    votesCount,
    subredditTopic,
    className,
}: PostProps) {
    const [vote, setVote] = useState<boolean | null>();
    const voteQuery = UseUpvoteQuery(id);
    const mutation = UseUpvoteMutation();
    const { data: session } = useSession();

    const upvote = async (isUpvote: boolean) => {
        if (!session) {
            toast("You'll need to sign in to Vote!");
            return;
        }
        if (vote && isUpvote) return;
        if (vote === false && !isUpvote) return;
        if (
            voteQuery?.data?.some(
                (vote) =>
                    vote.userId === session.user.id && vote.vote === isUpvote,
            )
        ) {
            return;
        }

        console.log('Voting...', isUpvote);

        await mutation.mutateAsync({ vote: isUpvote, postId: id });
        voteQuery.refetch();
    };

    const displayVotes = (data: UpvoteResponse[]) => {
        const displayNumber = data.reduce(
            (sum, current) => (current.vote === true ? (sum += 1) : (sum -= 1)),
            0,
        );

        if (data.length === 0) return 0;
        if (displayNumber === 0) {
            return data[0]?.vote ? 1 : -1;
        }

        return displayNumber;
    };

    useEffect(() => {
        const votes = voteQuery?.data;

        //Latest votes coming fro SQL query
        //We set vote to true, false or undefined with optional chaining using .find
        const vote = votes?.find(
            (vote) => vote.userId == session?.user?.id,
        )?.vote;

        setVote(vote);
    }, [voteQuery.data]);

    return (
        <div
            className={clsx(
                'bg-base-100 flex rounded-md cursor-pointer border border-neutral shadow-md hover:border-neutral-content',
                className,
            )}
        >
            {/* Votes */}
            <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md p-4 text-neutral">
                <button
                    onClick={() => {
                        upvote(true);
                    }}
                >
                    <FaArrowUp
                        className={`voteButtons hover:text-red-400 ${
                            vote && 'text-blue-500'
                        }`}
                    />
                </button>
                <p className="text-xs font-bold text-base-content">
                    {voteQuery.isSuccess && displayVotes(voteQuery?.data!)}
                </p>
                <button
                    onClick={() => {
                        upvote(false);
                    }}
                >
                    <FaArrowDown
                        className={`voteButtons hover:text-blue-400 ${
                            vote === false && 'text-red-400'
                        }`}
                    />
                </button>
            </div>
            <div className="p-3 pb-1">
                {/* Header */}
                <div className="flex items-center space-x-2">
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                            <img
                                src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${subredditTopic}`}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-content">
                        <Link href={`/subreddit/${subredditTopic}`}>
                            <span className="font-bold hover:link-primary">
                                r/{subredditTopic}
                            </span>
                        </Link>{' '}
                        * Posted by u/
                        {nickname} <TimeAgo date={createdAt} />
                    </p>
                </div>
                {/* Body */}
                <div className="py-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="mt-2 text-sm font-light">{body}</p>
                </div>

                {/* Image */}
                {imageId && (
                    <img
                        className="w-full"
                        src={getFullUrl(getAttachmentUrl(imageId))}
                        alt=""
                    />
                )}

                {/* Footer */}
                <div className="flex space-x-4 text-gray-400">
                    <div className="postButtons">
                        <BsChat className="h-6 w-6" />
                        <p className="hidden sm:inline">
                            {comentCount} Coments
                        </p>
                    </div>
                    <div className="postButtons">
                        <GoShareAndroid className="h-6 w-6" />
                        <p className="hidden sm:inline">Share</p>
                    </div>
                    <div className="postButtons">
                        <FaRegBookmark className="h-6 w-6" />
                        <p className="hidden sm:inline">Save</p>
                    </div>
                    <div className="postButtons">
                        <RxDotsHorizontal className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
