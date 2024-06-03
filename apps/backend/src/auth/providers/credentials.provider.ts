import { UsersService } from '@users/users.service';
import { Provider } from './provider.interface';
import { LoginDto } from '@auth/dto';
import { Provider as PrismaProvider, User } from '@prisma/client';
import { compare } from 'bcrypt';
import { Logger, UnauthorizedException } from '@nestjs/common';

export class CredentialsProvider implements Provider {
    private static instance: CredentialsProvider;
    private readonly logger = new Logger(CredentialsProvider.name);
    private constructor(private readonly userService: UsersService) {}
    static getInstance(userService: UsersService): Provider {
        if (!CredentialsProvider.instance) {
            CredentialsProvider.instance = new CredentialsProvider(userService);
        }
        return CredentialsProvider.instance;
    }
    async autorize(dtoOrAccessToken: string | LoginDto): Promise<User> {
        const dto = dtoOrAccessToken as LoginDto;
        const user: User = await this.userService
            .findByEmail(dto.email)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (
            !user ||
            user.provider !== PrismaProvider.CREDENTIALS ||
            (await compare(user.password, dto.password))
        ) {
            throw new UnauthorizedException('Incorrect login or password');
        }
        return user;
    }
}
