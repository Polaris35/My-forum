import { PostBox } from '@/features/post-box';
import { HomePageHeader } from '@/widgets/home-page-header';

export function HomePage() {
    return (
        <div className="h-screen overflow-y-scroll bg-base-200">
            <HomePageHeader />

            {/* Page content */}
            <div className="my-7 max-w-3xl mx-auto">
                <PostBox />
            </div>

            {/* Feed */}
        </div>
    );
}
