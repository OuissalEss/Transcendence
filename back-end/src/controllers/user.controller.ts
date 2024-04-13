import {Body, Controller, ForbiddenException, Get, Req, Post, Render} from '@nestjs/common';
import {UserService} from "../services/user.service";
import {Request} from 'express';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async me(@Req() req: Request){
    return await this.userService.getUserById(req['user']['sub']);
  }
}
