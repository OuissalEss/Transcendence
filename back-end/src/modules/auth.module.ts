
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { PrismaService } from 'src/services/prisma.service';

import { FTStrategy } from 'src/strategies/42.strategy';
import { GoogleStrategy } from 'src/strategies/google.strategy';

import { FTAuthGuard } from 'src/guards/auth.guard';
import { GoogleOauthGuard } from 'src/guards/google.guard';

import { jwtConstants } from 'src/auth/constants';
import { AuthController } from 'src/controllers/auth.controller';
import { AchievementService } from 'src/services/user_achievement.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FTAuthGuard,
    FTStrategy,
    GoogleStrategy,
    GoogleOauthGuard,
    UserService,
    AchievementService,
    PrismaService
  ],
})
export class AuthModule {}
