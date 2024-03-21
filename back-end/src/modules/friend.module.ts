import { Module } from '@nestjs/common';
import { FriendService } from "../services/friend.service";
import { FriendResolver } from "../resolvers/friend.resolver";
import { PrismaService } from "../services/prisma.service";
import { FriendController } from "../controllers/friend.controller";
import { UserService } from 'src/services/user.service';


@Module({
    providers: [FriendService, FriendResolver, UserService, PrismaService],
    controllers: [FriendController],
})
export class FriendModule { }
