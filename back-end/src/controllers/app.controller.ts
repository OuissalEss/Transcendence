import {Body, Controller, Get, Req, Post} from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Req() req: Request) {
    return { message: 'Ping Pong Multiplayer' };
  }

  @Post()
  async router(@Req() req: Request, @Body() body: Body): Promise<string> {
    console.log(req);
    return `HELLO ${body}`
  }

  @Get('validate')
  validation(@Req() req: Request, @Body() body: Body): Boolean {
    return true
  }
}
