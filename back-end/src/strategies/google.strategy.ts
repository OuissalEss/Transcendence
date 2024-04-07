import {
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as crypto from "crypto";
import { PrismaService } from "src/services/prisma.service";


import { UserService } from 'src/services/user.service';
import { userIncludes } from "src/includes/user.includes";
import { CreateUserInput } from "../services/dto/create-user.input";
import { User } from 'src/entities/user.entity';
import { AchievementService } from 'src/services/user_achievement.service';
import { Achievement } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private achievementService: AchievementService,
    private prisma: PrismaService
  ) {
    super({
      clientID: configService.get('GOOGLE_UID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URI'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    _done: VerifyCallback,
  ): Promise<{ user: User, firstLogIn: Boolean }> {
    let user = null;
    let firstLogIn = false;

    try {
      user = await this.prisma.user.findFirst({
        where: {
          connection: {
            provider: "google",
            providerId: `${profile.id}`,
          },
        },
        include: userIncludes,
      });
    } catch (e) { }

    try {
      if (!user) {
        firstLogIn = true;
        const emailParts = profile.emails[0].value.split('@');
        const data: CreateUserInput = {
          username: `${emailParts[0].toLocaleLowerCase()}_${crypto.randomBytes(5).readUInt16BE(0) % 10000}`,
          firstName: profile.name.givenName ? profile.name.givenName : '',
          lastName: profile.name.familyName ? profile.name.familyName : '',
          email: profile.emails[0].value,
          defaultFilename: profile.photos[0].value,
          filename: profile.photos[0].value,
          xp: 50,
          provider: "google",
          providerId: `${profile.id}`
        }
        user = await this.userService.createUser(data);
        const res = await this.achievementService.createAchievement(user.id, Achievement.welcome);
      }
    } catch (e) {
      console.log(e)
    }

    if (!user)
      throw new InternalServerErrorException("Unable to retrieve user");
    user = await this.userService.updateStatus(user.id, "ONLINE");

    return { user, firstLogIn };
  }
}