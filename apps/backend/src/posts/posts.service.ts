import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePostDto } from './dto';
import { PostResponse } from './responses/post.response';
import { FileUrlUtils } from '@common/utils';

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
            select: {
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
            },
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
}
