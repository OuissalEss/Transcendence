import { Module } from '@nestjs/common';
import {PrismaService} from "../services/prisma.service";
import {ChannelUserService} from "../services/channel-user.service";
import {ChannelUserResolver} from "../resolvers/channel-user.resolver";
import {ChannelUserController} from "../controllers/channel-user.controller";

@Module({
    providers: [ChannelUserService, PrismaService, ChannelUserResolver],
    controllers: [ChannelUserController]
})
export class ChannelUserModule {
    
}
