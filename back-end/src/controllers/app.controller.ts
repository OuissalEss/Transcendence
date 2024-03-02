import {Body, Controller, ForbiddenException, Get, Req, Post, Render} from '@nestjs/common';

import { Public } from "src/auth/public-metadata";
import {ChannelService} from "../services/channel.service";
import {Channel} from "../entities/channel.entity";
import {PrismaService} from "../services/prisma.service";
import {ChannelUser} from "../entities/channel-user.entity";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Req() req: Request, @Body() body) {
    return { message: 'Ping Pong Multiplayer' };
  }

  @Post()
  async router(@Req() req: Request, @Body() body): Promise<string> {
    console.log(req);
    return `HELLO ${body}`
  }

  @Get('validate')
  validation(@Req() req: Request, @Body() body): Boolean {
    return true
  }
}
