import { Module } from "@nestjs/common";
import { GameGateway } from "../gateway/game.gateway";
import { MatchService } from "src/services/match.service";
import { PrismaService } from "src/services/prisma.service";
import { UserService } from "../services/user.service";
import { FriendService } from "src/services/friend.service";
import { NotificationService } from "src/services/notification.service";
import { AchievementService } from "src/services/user_achievement.service";

@Module({
	providers: [GameGateway, MatchService, PrismaService, UserService, FriendService, NotificationService, AchievementService],
})
export class GameModule {
}