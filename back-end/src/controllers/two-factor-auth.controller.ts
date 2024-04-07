import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { GetUser } from "../decorators/current-userid.decorator";
import { User } from "../entities/user.entity";
import { TwoFactorAuthService } from "../services/two-factor-auth.service";
import { Response } from 'express';
import { TwoFaAuthDto } from "./dto/two-fa-auth.dto";
import { AuthService } from "src/services/auth.service";
import { ConfigService } from "@nestjs/config";

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Get('generate-qr')
    async generateQrCode(
        @GetUser() user
    ) {
        const { generated, secret, otpAuthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthSecret(user.sub);

        if (!generated) {
            throw new ForbiddenException('2FA is already activated');
        }

        // response.setHeader('content-type', 'image/png');

        // return this.twoFactorAuthService.qrCodeStreamPipe(response, otpAuthUrl);

        // Instead of directly streaming the image, return a JSON object
        return {
            code: secret, // Assuming `secret` contains the generated code
            imageUrl: otpAuthUrl
        };
    }

    @Post('turn-on-qr')
    async activationOfTwoFa(
        @GetUser() user, // Assuming this retrieves the authenticated user
        @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto,
    ) {
        // Activate two-factor authentication
        const activation = await this.twoFactorAuthService.activationOfTwoFa(
            twoFaAuthDto.code,
            user.sub,
            true,
        );

        // Generate JWT access token for the user
        const accessToken = await this.authService.getJwttoken(user.sub, true, false);

        return ({ accessToken });
    }

    @Post('authenticate')
    async authenticate(
        @GetUser() user,
        @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto
    ) {

        const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(twoFaAuthDto.code, user.sub);

        if (!isCodeValid) {
            throw new UnauthorizedException('Invalid authentication code');
        }

        const accessToken = await this.authService.getJwttoken(user.sub, true, false);

        return ({ accessToken });
    }
}