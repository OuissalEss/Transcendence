import { Module } from '@nestjs/common';
import {PrismaService} from "../services/prisma.service";
import {ChannelUserResolver} from "../resolvers/channel-user.resolver";
import {ChannelUserController} from "../controllers/channel-user.controller";
import { ChannelUserService } from 'src/services/channel-user.service';

@Module({
    providers: [ChannelUserService, PrismaService, ChannelUserResolver],
    controllers: [ChannelUserController],
    exports: [ChannelUserService]
})
export class ChannelUserModule {
    
}
