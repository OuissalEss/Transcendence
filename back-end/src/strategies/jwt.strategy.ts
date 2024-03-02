//import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { PassportStrategy } from '@nestjs/passport';
//import { ExtractJwt, Strategy, JwtPayload } from 'passport-jwt';
//import { GetUserById } from 'src/application/use-cases/user/get-user-by-id';
//import { jwtConstants } from './constants';
//
//@Injectable()
//export class JwtStrategy extends PassportStrategy(Strategy) {
//    constructor(private readonly getUserById: GetUserById) {
//        super({
//            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//            ignoreExpiration: false,
//            secretOrKey: jwtConstants.secret,
//        });
//    }
//
//    async validate(payload: JwtPayload) {
//        const user = await this.getUserById.execute(payload.sub);
//        if (!user || !payload) {
//            throw new UnauthorizedException();
//        }
//        return user;
//    }
//}
//
//// guards/constants.ts
//
//export const jwtConstants = {
//    secret: process.env.JWT_SECRET,
//};