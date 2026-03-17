export interface AuthResponse {
    token: string;
    refreshToken: string;
    identifier: number;
    expiration: number;

}