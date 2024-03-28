import User from "./user-interface";

export default interface Block {
    id: string,
    blockedUser: {
        id: string,
        username: string,
        avatar: {filename: string},
    },
    blocker: {
        id: string,
        username: string,
        avatar: {filename: string},
    }
    // blockedUser: User,
    // blocker: User,
}
