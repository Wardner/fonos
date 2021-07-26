export interface CreateTokenRequest {
    accessKeyId: string;
    roleName?: string;
    expiration?: "1s" | "1m" | "1d" | "30d" | "1y";
}
export interface CreateTokenResponse {
    token: string;
}
export interface ValidateTokenRequest {
    token: string;
}
