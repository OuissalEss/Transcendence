import { Module } from '@nestjs/common';
import {FriendService} from "../services/friend.service";
import {FriendResolver} from "../resolvers/friend.resolver";
import {PrismaService} from "../services/prisma.service";
import {FriendController} from "../controllers/friend.controller";


@Module({
    providers: [FriendService, FriendResolver, PrismaService],
    controllers: [FriendController],
})
export class FriendModule {}
