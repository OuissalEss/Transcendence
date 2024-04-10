import User from "./user-interface";

export default interface Match {
    id: string,
    host_score_m: number,
    guest_score_m: number,
    host: User,
    guest: User,
    loser: User,
    winner: User,
}
