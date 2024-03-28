import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

import { UserAchievement } from "src/entities/user_achievement.entity";
import { Achievement } from '@prisma/client';
import { achievementIncludes } from "src/includes/user_achievement.includes";
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";
import { use } from "passport";
// Define the Achievement enum

@Injectable()
export class AchievementService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) { }

  async createAchievement(userId: string, achievement_title: Achievement): Promise<UserAchievement> {
    try {
      return this.prisma.userAchievement.create({
        data: {
          userId: userId,
          achievement: achievement_title,
        },
        include: achievementIncludes
      });
    } catch (e) {
      throw new ForbiddenException("Unable to Create Achievement");
    }
  }
}