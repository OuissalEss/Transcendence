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
import {Connection} from "../entities/connection.entity";
import { userIncludes } from "src/includes/user.includes";
import {CreateUserInput} from "../services/dto/create-user.input";
import { User } from 'src/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
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
  ): Promise<{user: User, firstLogIn: Boolean}> {
    let user= null;

    /* TO-DO: Searching for the user if exist */
    let firstLogIn: Boolean = false;

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
    } catch (e) {}

    try {
      if (!user) {
        firstLogIn = true;
        const data: CreateUserInput = {
          username: `${(profile.name.familyName+profile.name.givenName).toLocaleLowerCase()}_${crypto.randomBytes(5).readUInt16BE(0) % 10000}`,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          defaultFilename: profile.photos[0].value,
          filename: profile.photos[0].value,
          xp: 0,
          provider: "google",
          providerId: `${profile.id}`
        }
        user = await this.userService.createUser(data);
      }
    } catch (e) {
      console.log(e)
    }

    console.log(user);
    if (!user)
      throw new InternalServerErrorException("Unable to retrieve user");
      
    return {user, firstLogIn};
  }
}