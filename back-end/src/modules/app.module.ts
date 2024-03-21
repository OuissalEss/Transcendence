import { join } from 'path';
import {APP_GUARD} from "@nestjs/core";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';

import { PrismaService } from 'src/services/prisma.service';
import { AppController } from 'src/controllers/app.controller';


import {JwtGuard} from "src/guards/jwt.guard";
import {FriendModule} from "./friend.module";
import {ChannelModule} from "./channel.module";
import {ChannelUserModule} from "./channel-user.module";
import {MessageModule} from "./message.module";
import {NotificationModule} from "./notification.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";

import {ChatGateway} from 'src/gateway/chat.gateway';
import {GameModule} from "./game.module";
import { MatchModule } from './match.module';

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Use Apollo Server
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true, // Enable GraphQL Playground
      sortSchema: true, // Sort schema alphabetically
      includeStacktraceInErrorResponses: true, // Disable stacktraces
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    MatchModule,
    FriendModule,
    ChannelModule,
    ChannelUserModule,
    MessageModule,
    NotificationModule,
    GameModule
  ],
  controllers: [AppController],
  providers: [
    ChatGateway,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
//    {
//      provide: APP_GUARD,
//      useClass: ThrottlerGuard
//    }
  ],
})
export class AppModule {}
