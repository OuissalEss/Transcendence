import { AuthService } from "./auth.service";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { authenticator } from "otplib";
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { JwtResponse, Payload, ValidatePayload } from "./types/auth.service";
import { UserService } from "./user.service";

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    public async generateTwoFactorAuthSecret(userId: string) {
        try {
            const user = await this.userService.getUserById(userId);

            if (!user) throw new NotFoundException("User does't exist");

            if (user.connection.is2faEnabled) {
                return {
                    generated: false
                }
            }

            const secret = authenticator.generateSecret();
            const app_name = process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || 'Spin&Smash';
            const otpAuthUrl = authenticator.keyuri(user.email, app_name, secret);

            await this.userService.updateOtp(userId, secret);

            return {
                generated: true,
                secret,
                otpAuthUrl
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    public async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
        try {
            return toFileStream(stream, otpPathUrl);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    public async activationOfTwoFa(code: string, userId: string, status: boolean) {
        try {
            const user = await this.userService.getUserById(userId);

            if (!user) throw new NotFoundException("User does't exist");

            if (!user.connection.otp) {
                throw new UnauthorizedException('2Fa OTP is not Configured');
            }

            if (user.connection.is2faEnabled) {
                throw new UnauthorizedException('2Fa is already Activated');
            }

            // Activating 2fa
            const isCodeValid = await this.verifyTwoFaCode(code, userId);

            if (!isCodeValid) {
                throw new UnauthorizedException('Invalid authentication code');
            }
            return await this.userService.activate2Fa(userId, status);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    public async verifyTwoFaCode(code: string, userId: string) {
        try {
            const user = await this.userService.getUserById(userId);

            if (!user) throw new NotFoundException("User does't exist");

            return authenticator.verify({
                token: code,
                secret: user.connection.otp
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
}