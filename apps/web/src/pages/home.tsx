import { Feed } from '@/features/feed';
import { PostBox } from '@/features/post-box';
import { HomePageHeader } from '@/widgets/home-page-header';

export function HomePage() {
    return (
        <div className="h-screen overflow-y-scroll bg-base-200">
            <HomePageHeader />

            {/* Page content */}
            <div className="my-7 max-w-5xl mx-auto">
                <PostBox />

                {/* Feed */}
                <div className="flex">
                    <Feed />
                </div>
            </div>
        </div>
    );
}
