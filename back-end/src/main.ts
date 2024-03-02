import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/modules/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));


  app.enableCors();

  app.use(passport.initialize())
  await app.listen(3000);
}
bootstrap().catch((err: Error) => console.error(err));
