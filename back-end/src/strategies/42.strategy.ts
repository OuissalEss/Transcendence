import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/services/prisma.service';
import { userIncludes } from "src/includes/user.includes";
import * as crypto from "crypto";

import { CreateUserInput } from "../services/dto/create-user.input";

import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    configService: ConfigService,
    // private authService: AuthService,
    private userService: UserService,
    private prisma: PrismaService
  ) {
    super({
      clientID: configService.get('42_UID'),
      clientSecret: configService.get('42_SECRET'),
      callbackURL: configService.get('42_CALLBACK_URI'),
      Scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ): Promise<{ user: User, firstLogIn: Boolean }> {

    let user = null;
    let firstLogIn = false;

    try {
      user = await this.prisma.user.findFirst({
        where: {
          connection: {
            provider: "42",
            providerId: `${profile.id}`,
          },
        },
        include: userIncludes,
      });
    } catch (e) { }

    try {
      if (!user) {
        let profileUsername = profile.username;

        // check username existance
        let userdata = await this.prisma.user.findFirst({
          where: {
            username: profileUsername
          }
        });

        if (userdata)
          profileUsername = `${profile.username}_${crypto.randomBytes(5).readUInt16BE(0) % 10000}`;
        firstLogIn = true;
        const data: CreateUserInput = {
          username: profileUsername,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          defaultFilename: profile._json.image.link,
          filename: profile._json.image.link,
          xp: 50,
          provider: "42",
          providerId: `${profile.id}`
        }
        console.log(data);
        user = await this.userService.createUser(data);
      }
    } catch (e) {
      console.log(e);
    }


    if (!user)
      throw new InternalServerErrorException("Unale to retrieve user");

    user = await this.userService.updateStatus(user.id, "ONLINE");

    return { user, firstLogIn };
  }
}