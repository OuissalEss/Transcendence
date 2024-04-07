import User from "./user-interface";

export default interface Notifs {
    id: string,
    time: Date,
    type: string,
    isRead: Boolean,
    sender: User,
    receiver: User,
}
