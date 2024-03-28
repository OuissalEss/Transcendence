import { Query, Resolver, Mutation, Context, Args } from "@nestjs/graphql";
import { UserAchievement } from "../entities/user_achievement.entity";
import { Achievement } from '@prisma/client';
import { AchievementService } from "../services/user_achievement.service";
import { Payload } from "src/services/types/auth.service";
import { User } from "src/entities/user.entity";
import { ForbiddenError } from "@nestjs/apollo";

@Resolver(of => Achievement)
export class AchievementResolver {
    constructor(private readonly achievementService: AchievementService) { }

    @Mutation(() => Achievement, {
        name: "createAchievement",
        description: "create achievement with their associated id"
    })
    createAchievement(@Args('achievement_title') achievement_title: Achievement, @Context() context: { req }): Promise<UserAchievement> {
        const payload: Payload = context.req['user'];
        return this.achievementService.createAchievement(payload.sub, achievement_title);
    }

}