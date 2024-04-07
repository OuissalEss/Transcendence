import Block from "./block-interface";
import Match from "./match-interface";

export default interface User {
    xp: number;
    id: string,
    username: string,
    email: string,
    status: string,
    character: string,
    avatar: {
        filename: string;
    },
    connection: {
        provider: string,
        is2faEnabled: boolean,
    }
    achievements: {
        achievement: string;
    },
    blocking: Block,
    winner: Match,
    loser: Match,
    host: Match,
    guest: Match,
}
