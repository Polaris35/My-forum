export const PostResponseRaw = {
    id: true,
    title: true,
    body: true,
    subreddit: {
        select: {
            id: true,
            topic: true,
        },
    },
    image: true,
    creator: {
        select: {
            image: true,
            name: true,
        },
    },
    Vote: {
        select: {
            upvote: true,
        },
    },
    _count: {
        select: {
            Comments: true,
        },
    },
    createdAt: true,
};
