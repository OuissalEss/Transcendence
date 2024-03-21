import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtResponse, Payload } from "./types/auth.service"
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * Generates JwT token for given user.
     *
     * @returns {Promise<JwtResponse>} Jwt Token
     * @param user
     */
    async getJwttoken(data: any): Promise<JwtResponse> {
        const user: User = data.user;
        const payload: Payload = {
            sub: user.id,
            username: user.username,
            createdAt: user.createdAt,
            firstLogIn: data.firstLogIn,
        };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
