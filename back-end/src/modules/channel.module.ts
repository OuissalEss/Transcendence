import { Module } from '@nestjs/common';
import {ChannelService} from "src/services/channel.service";
import {ChannelResolver} from "src/resolvers/channel.resolver";
import {PrismaService} from "src/services/prisma.service";
import {ChannelController} from "src/controllers/channel.controller";

@Module({
    providers: [ChannelService, ChannelResolver, PrismaService],
    controllers: [ChannelController]
})
export class ChannelModule {}
