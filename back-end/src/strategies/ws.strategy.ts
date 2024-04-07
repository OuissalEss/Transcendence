import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';


import { User } from '../entities/user.entity';

// import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
    constructor(
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
            secretOrKey: 'topSecret21',
        });
    }

    async validate(payload) {
        const { username } = payload;
    }
}