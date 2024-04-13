import { Body, Controller, Get, Req, Post, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Character } from '@prisma/client';
import { GetUser } from 'src/decorators/current-userid.decorator';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import {Request} from 'express';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @Get()
  root(@Req() req: Request) {
    return { message: 'Ping Pong Multiplayer' };
  }

  @Post()
  async router(@Req() req: Request, @Body() body: Body): Promise<string> {
    return `HELLO ${body}`
  }

  @Get('validate')
  validation(@Req() req: Request, @Body() body: Body): Boolean {
    return true
  }

  @Get('validateLogin')
  async validateFirstLogin(@GetUser() user,
  ) {
    const userData = await this.userService.getUserById(user.sub);

    if (!userData) throw new NotFoundException("User does't exist");

    if (userData.character == Character.None)
      throw new ForbiddenException('You need to select a character.');

    const accessToken = await this.authService.getJwttoken(user.sub, true, false);

    return ({ accessToken });
  }

}
