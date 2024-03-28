export default interface Friend {
    id: string,
    isAccepted: boolean,
    receiver: {
        id: string,
    }
    sender: {
        id: string,
    }
}
