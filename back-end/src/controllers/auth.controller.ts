import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

import { AuthService } from 'src/services/auth.service';
import { FTAuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/auth/public-metadata';
import { GoogleOauthGuard } from 'src/guards/google.guard';
import { JwtResponse, Payload, ValidatePayload } from "../services/types/auth.service";
import { GetUser } from 'src/decorators/current-userid.decorator';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Public()
  @UseGuards(FTAuthGuard)
  @Get('42')
  auth42() {

  }

  @Public()
  @UseGuards(FTAuthGuard)
  @Get('42-redirect')
  async auth42Redirect(
    @GetUser() data: { user: User, firstLogIn: boolean },
    @Res() res: Response

  ) {
    console.log(data);
    const token: JwtResponse = await this.authService.getJwttoken(data.user.id, false, data.firstLogIn);

    res.cookie('token', token['access_token'], {
      maxAge: 2592000000,
    });

    res.redirect(`${this.configService.get("CLIENT_URL")}/`);
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  authGoogle() {
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async authGoogleCallBack(
    @GetUser() data: { user: User, firstLogIn: boolean },
    @Res() res: Response
  ) {
    console.log(data);
    const token: JwtResponse = await this.authService.getJwttoken(data.user.id, false, data.firstLogIn);

    res.cookie('token', token['access_token'], {
      maxAge: 2592000000,
    });

    res.redirect(`${this.configService.get("CLIENT_URL")}/`);
  }
}
