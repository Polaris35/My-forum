import { UiAvatar } from '@/shared/ui';
import { getAttachmentUrl, getFullUrl } from '@/shared/utils';
import Link from 'next/link';
import { BsChat } from 'react-icons/bs';
import { FaArrowDown, FaArrowUp, FaRegBookmark } from 'react-icons/fa6';
import { GoShareAndroid } from 'react-icons/go';
import { RxDotsHorizontal } from 'react-icons/rx';
import TimeAgo from 'react-timeago';

type PostProps = {
    userAvatar: string;
    nickname: string;
    createdAt: string;
    title: string;
    body: string;
    imageId: number | null;
    subredditTopic: string;
    votesCount: number;
    comentCount: number;
};
export function Post({
    userAvatar,
    nickname,
    createdAt,
    title,
    body,
    imageId,
    comentCount,
    votesCount,
    subredditTopic,
}: PostProps) {
    return (
        <div
            className="bg-base-100 flex rounded-md cursor-pointer border border-neutral shadow-md
          hover:border-neutral-content"
        >
            {/* Votes */}
            <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md p-4 text-neutral">
                <FaArrowUp className="voteButtons hover:text-red-400" />
                <p className="text-xs font-bold text-base-content">0</p>
                <FaArrowDown className="voteButtons hover:text-blue-400" />
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

/* <div className="flex flex-col">
            <div className="flex">
                <UiAvatar url={userAvatar} size={'small'} />
                <p>{nickname}</p>
                <p>{createdAt.toString()}</p>
            </div>
            <div>
                <p className="text-xl">{title}</p>
                <div className="flex">
                    <p className="text-gray-500">{body}</p>
                     {<img src="" alt={'image id: ' + imageId} /> }
                </div>
            </div>
        </div> 
*/
