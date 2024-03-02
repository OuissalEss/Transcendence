export interface JwtResponse {
    access_token: string;
}

export interface Payload {
    sub: int;
    username: string;
    createdAt: date;
}