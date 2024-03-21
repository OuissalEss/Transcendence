import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { User } from '@prisma/client';

import { AuthService } from 'src/services/auth.service';
import { FTAuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/auth/public-metadata';
import { GoogleOauthGuard } from 'src/guards/google.guard';
import {JwtResponse} from "../services/types/auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
    ) {}

  @Public()
  @UseGuards(FTAuthGuard)
  @Get('42')
  auth42() {
  
  }

  // @Public()
  // @UseGuards(FTAuthGuard)
  // @Get('42-redirect')
  // async auth42Redirect(
  //   @Req() req: Request & {user: User},
  //   @Res() res: Response
    
  //   ) {
  //   const token : JwtResponse = await this.authService.getJwttoken(req.user);

  //   res.cookie('token', token['access_token'], {
  //     maxAge: 2592000000,
  //   });

  //   res.redirect(`${this.configService.get("CLIENT_URL")}/dashboard/profile`);     // res.json(token);
  // }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  authGoogle() {
  }
  
  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async authGoogleCallBack(
    @Req() req: Request & {user : User, firstLogIn: Boolean},
    @Res() res: Response
    ) {
    const token: JwtResponse = await this.authService.getJwttoken(req.user);

    res.cookie('token', token['access_token'], {
      maxAge: 2592000000,
    });
    if ( true )
    
    req.firstLogIn = false;
    res.redirect(`${this.configService.get("CLIENT_URL")}/`);
  }
}
