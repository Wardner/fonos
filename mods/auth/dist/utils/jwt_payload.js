"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JwtPayload {
    constructor(issuer, role, accessKeyId) {
        this.iss = issuer;
        this.role = role;
        this.accessKeyId = accessKeyId;
    }
}
exports.default = JwtPayload;
