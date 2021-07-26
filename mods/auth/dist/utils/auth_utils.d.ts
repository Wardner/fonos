import JwtPayload from "./jwt_payload";
import ITokenManager from "./itoken_manager";
export declare interface UserToken {
    accessToken: string;
}
export declare interface TokenResponse {
    isValid: boolean;
    data: JwtPayload;
}
export default class AuthUtils {
    private handler;
    constructor(handler: ITokenManager);
    validateTokenData: (payload: JwtPayload) => boolean;
    createToken: (accessKeyId: string, issuer: string, role: string, privateKey: string, expiration?: string) => Promise<UserToken>;
    validateToken: (token: UserToken, privateKey: string) => Promise<TokenResponse>;
}
