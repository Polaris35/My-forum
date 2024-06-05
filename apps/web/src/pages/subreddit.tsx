import { Feed } from '@/features/feed';
import { PostBox } from '@/features/post-box';
import { HomePageHeader } from '@/widgets/home-page-header';
import { useRouter } from 'next/router';

export function SubredditPage() {
    const {
        query: { topic },
    } = useRouter();

    return (
        <div className="h-screen overflow-y-scroll bg-base-200">
            <HomePageHeader />

            {/* Page content */}

            <div className="h-24 bg-accent p-8">
                <div className="-mx-8 mt-10 bg-base-100">
                    <div className="max-w-5xl mx-auto flex items-center space-x-4 pb-3">
                        <div className="-mt-5">
                            <div className="avatar">
                                <div className="w-16 h-16 rounded-full">
                                    <img
                                        src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${topic}`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="py-2">
                            <h1 className="text-3xl font-semibold">
                                Welcome to r/{topic} subreddit
                            </h1>
                            <p className="text-sm text-gray-400">r/{topic}</p>
                        </div>
                    </div>
                </div>
                <div className="my-7 mt-5 max-w-5xl mx-auto">
                    <PostBox subreddit={topic as string} />
                    <Feed subreddit={topic as string} />
                </div>
            </div>
        </div>
    );
}
