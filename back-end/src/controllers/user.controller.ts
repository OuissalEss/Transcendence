import {Body, Controller, ForbiddenException, Get, Req, Post, Render} from '@nestjs/common';
import {UserService} from "../services/user.service";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async me(@Req() req: Request){
    console.log(req['user']);
    return await this.userService.getUserById(req['user'].sub);
  }
}
