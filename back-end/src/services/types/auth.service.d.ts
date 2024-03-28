import { User } from "src/entities/user.entity";

export interface JwtResponse {
    access_token: string;
}

export interface Payload {
    sub: int;
    username: string;
    createdAt: date;
    isFirstTime: boolean
    isTwoFactorEnable: boolean
    isTwoFaAuthenticated: boolean
}

export interface ValidatePayload {
    id: string,
    username: string;
    isTwoFactorEnable: boolean
    isTwoFaAuthenticated: boolean
}