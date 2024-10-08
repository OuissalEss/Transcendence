import { Module } from '@nestjs/common';
import { FriendService } from "../services/friend.service";
import { FriendResolver } from "../resolvers/friend.resolver";
import { PrismaService } from "../services/prisma.service";
import { FriendController } from "../controllers/friend.controller";
import { UserService } from 'src/services/user.service';
import { AchievementService } from 'src/services/user_achievement.service';
import { NotificationService } from 'src/services/notification.service';


@Module({
    providers: [FriendService, FriendResolver, UserService, PrismaService, AchievementService, NotificationService],
    controllers: [FriendController],
})
export class FriendModule { }
