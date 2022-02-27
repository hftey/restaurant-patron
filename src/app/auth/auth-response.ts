export interface AuthResponse {
    User: {
        id: number,
        email: string,
        name: string,
        password: string,
    },
    token: string,
    expires_in: number

}
