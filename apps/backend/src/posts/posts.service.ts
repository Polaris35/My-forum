import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCommentDto, CreatePostDto } from './dto';
import { PostResponse } from './responses/post.response';
import { FileUrlUtils } from '@common/utils';
import { PostResponseRaw } from './select-query';
import { CommentResponse } from './responses/commnet.response';
import { PostDataResponse } from './responses/post-data.response';

@Injectable()
export class PostsService {
    constructor(private readonly prismaService: PrismaService) {}
    async create(dto: CreatePostDto, userId: number) {
        // Проверяем, существует ли запись Subreddit с topic === dto.subreddit
        let subreddit = await this.prismaService.subreddit.findFirst({
            where: {
                topic: dto.subreddit,
            },
        });

        // Если запись не существует, создаем её
        if (!subreddit) {
            subreddit = await this.prismaService.subreddit.create({
                data: {
                    topic: dto.subreddit,
                },
            });
        }

        // Создаем запись Post, связывая её с найденным или созданным Subreddit
        return this.prismaService.post.create({
            data: {
                title: dto.title,
                body: dto.body,
                subreddit: {
                    connect: {
                        id: subreddit.id,
                    },
                },
                creator: {
                    connect: {
                        id: userId,
                    },
                },
                image: dto.imageId,
            },
        });
    }
    async getAllPosts(subreddit?: string): Promise<PostResponse[]> {
        const posts = await this.prismaService.post.findMany({
            where: {
                ...(subreddit && {
                    subreddit: {
                        topic: subreddit,
                    },
                }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: PostResponseRaw,
        });

        return posts.map((post) => {
            return {
                id: post.id,
                title: post.title,
                body: post.body,
                imageId: post.image,
                createdAt: post.createdAt,
                creatorAvatar: FileUrlUtils.getFileUrl(post.creator.image),
                creatorUsername: post.creator.name,

                subredditId: post.subreddit.id,
                subredditTopic: post.subreddit.topic,
                votesCount: post.Vote.reduce(
                    (sum, current) => (current.upvote ? sum++ : sum--),
                    0,
                ),
                commentsCount: post._count.Comments,
            };
        });
    }
    async getPostById(id: number): Promise<PostDataResponse> {
        const post = await this.prismaService.post.findFirst({
            where: {
                id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: PostResponseRaw,
        });
        const comments = await this.getAllComments(id);

        return {
            id: post.id,
            title: post.title,
            body: post.body,
            imageId: post.image,
            createdAt: post.createdAt,
            creatorAvatar: FileUrlUtils.getFileUrl(post.creator.image),
            creatorUsername: post.creator.name,

            subredditId: post.subreddit.id,
            subredditTopic: post.subreddit.topic,
            votesCount: post.Vote.reduce(
                (sum, current) => (current.upvote ? sum++ : sum--),
                0,
            ),
            commentsCount: post._count.Comments,
            comments,
        };
    }
    addComment(dto: CreateCommentDto, userId: number) {
        return this.prismaService.comments.create({
            data: {
                text: dto.comment,
                post: {
                    connect: {
                        id: dto.postId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
    async getAllComments(postId: number): Promise<CommentResponse[]> {
        const comments = await this.prismaService.comments.findMany({
            where: {
                post: {
                    id: postId,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                text: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return comments.map((comment) => {
            return {
                id: comment.id,
                text: comment.text,
                createdAt: comment.createdAt,
                userAvatar: FileUrlUtils.getFileUrl(comment.user.image),
                username: comment.user.name,
            };
        });
    }
}
