"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_payload_1 = __importDefault(require("./jwt_payload"));
const logger_1 = __importDefault(require("@fonos/logger"));
class AuthUtils {
    constructor(handler) {
        this.validateTokenData = (payload) => {
            if (!payload ||
                !payload.iss ||
                !payload.accessKeyId ||
                !payload.iss ||
                !payload.role)
                throw new Error("Invalid Access Token");
            return true;
        };
        this.createToken = async (accessKeyId, issuer, role, privateKey, expiration) => {
            const accessToken = await this.handler.encode(new jwt_payload_1.default(issuer, role, accessKeyId), privateKey, expiration);
            if (!accessToken)
                throw new Error("Error creating token");
            return {
                accessToken: accessToken
            };
        };
        this.validateToken = async (token, privateKey) => {
            let result = false;
            try {
                const accessTokenData = await this.handler.decode(token.accessToken, privateKey);
                if (accessTokenData) {
                    result = true;
                }
                return {
                    data: accessTokenData,
                    isValid: result
                };
            }
            catch (e) {
                logger_1.default.log("error", "@fonos/auth [Error decoding token]");
            }
            return {
                isValid: result
            };
        };
        this.handler = handler;
    }
}
exports.default = AuthUtils;
