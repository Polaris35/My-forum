import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { EventsModule } from './events/events.module';
import { MessagingModule } from '@messaging/messaging.module';
import { JwtModule } from '@nestjs/jwt';
import { options } from '@auth/config';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        MessagingModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.registerAsync(options()),
        EventsModule,
        AttachmentsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
