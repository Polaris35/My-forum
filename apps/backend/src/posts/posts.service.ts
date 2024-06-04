import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePostDto } from './dto';

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
}
