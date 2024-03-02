export default interface User {
    id: string,
    username: string,
    email: string,
    connection: {
      provider: string,
      is2faEnabled: boolean,
    }
}
