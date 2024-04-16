import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtResponse, Payload } from "./types/auth.service"
import { User } from "@prisma/client";
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) { }

    /**
     * Generates JwT token for given user.
     *
     * @returns {Promise<JwtResponse>} Jwt Token
     * @param user
     */
    async getJwttoken(userId: string, isTwoFaAuthenticated: boolean, isFirstTime: boolean): Promise<JwtResponse> {
        try {
            const user = await this.userService.getUserById(userId);

            if (!user) throw new NotFoundException("User does't exist");

            const payload: Payload = {
                sub: user.id,
                username: user.username,
                isFirstTime: isFirstTime,
                isTwoFaAuthenticated: isTwoFaAuthenticated,
                isTwoFactorEnable: user.connection.is2faEnabled,
                createdAt: user.createdAt,
            };

            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
}
