import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

import { UserAchievement } from "src/entities/user_achievement.entity";
import { Achievement } from '@prisma/client';
import { achievementIncludes } from "src/includes/user_achievement.includes";
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";
import { use } from "passport";
import { CreateNotificationInput } from "./dto/create-notification.input";
import { NotifType as NotificationType } from '@prisma/client';
import { NotificationService } from "./notification.service";
// Define the Achievement enum

@Injectable()
export class AchievementService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) { }

  async createAchievement(userId: string, achievement_title: Achievement): Promise<UserAchievement> {
    try {
      const user = await this.userService.getUserById(userId);
      const userAchievements = user.achievements.find(achievement => achievement.achievement === achievement_title);
      if (userAchievements) {
        return userAchievements;
      }
      const createdAchievement = this.prisma.userAchievement.create({
        data: {
          userId: userId,
          achievement: achievement_title,
        },
        include: achievementIncludes
      });
      const notifData: CreateNotificationInput = {
        type: NotificationType.ACHIEVEMENT,
        isRead: false,
        senderId: userId,
        receiverId: userId,
        inviteCode: ''
      }
      this.notificationService.createNotification(notifData);
      return createdAchievement;
    } catch (e) {
      throw new ForbiddenException("Unable to Create Achievement");
    }
  }

  async getUserAchievement(userId: string): Promise<UserAchievement[]> {
    try {
      const userAchievements = this.prisma.userAchievement.findMany({
        where: {
          userId: userId,
        },
        include: achievementIncludes
      });
      return userAchievements;
    } catch (e) {
      throw new ForbiddenException("Unable to Create Achievement");
    }
  }
}