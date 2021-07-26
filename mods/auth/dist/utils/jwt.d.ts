import JwtPayload from "./jwt_payload";
import ITokenManager from "./itoken_manager";
export default class JWT implements ITokenManager {
    encode(payload: JwtPayload, privateKey: string, expiresIn?: string): Promise<string>;
    /**
     * Returns the decoded payload if the signature is valid even if it is expired
     */
    decode(token: string, privateKey: string): Promise<JwtPayload>;
}
