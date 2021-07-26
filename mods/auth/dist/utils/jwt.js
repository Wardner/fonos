"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = __importDefault(require("@fonos/logger"));
/*
 * issuer 		— Organization who issue the toke.
 * role       — User role
 * accessKey  — User access key
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */
class JWT {
    async encode(payload, privateKey, expiresIn = "30d") {
        if (!privateKey)
            throw new Error("Token generation failure");
        // @ts-ignore
        return util_1.promisify(jsonwebtoken_1.sign)({ ...payload }, privateKey, {
            expiresIn
        });
    }
    /**
     * Returns the decoded payload if the signature is valid even if it is expired
     */
    async decode(token, privateKey) {
        try {
            // @ts-ignore
            return (await util_1.promisify(jsonwebtoken_1.verify)(token, privateKey, {
                ignoreExpiration: false
            }));
        }
        catch (e) {
            logger_1.default.log("error", "@fonos/auth [Bad token]");
            throw new Error(e);
        }
    }
}
exports.default = JWT;
