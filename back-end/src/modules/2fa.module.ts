import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { TwoFactorAuthService } from 'src/services/two-factor-auth.service';
import { TwoFactorAuthController } from 'src/controllers/two-factor-auth.controller';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';

@Module({
    providers: [TwoFactorAuthService, UserService, AuthService, PrismaService],
    controllers: [TwoFactorAuthController],
})
export class TwoFactorAuthModule { }
