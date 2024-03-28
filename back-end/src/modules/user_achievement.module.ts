import { Module } from '@nestjs/common';
import { AchievementService } from "../services/user_achievement.service";
import { AchievementResolver } from "../resolvers/user_achievement.resolver";
import { PrismaService } from "../services/prisma.service";
import { AchievementController } from "../controllers/user_achievement.controller";
import { UserService } from 'src/services/user.service';


@Module({
    providers: [AchievementService, AchievementResolver, UserService, PrismaService],
    controllers: [AchievementController],
})
export class AchievementModule { }
