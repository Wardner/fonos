"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@fonos/auth");
const certs_1 = require("@fonos/certs");
// Obtains a set of credentials for the docker image
// TODO: Role should be a constant somewhere
async function default_1(accesKeyId) {
    const auth = new auth_1.AuthUtils(new auth_1.Jwt());
    const token = await auth.createToken(accesKeyId, certs_1.AUTH_ISS, "FUNCTION", certs_1.getSalt());
    return token.accessToken;
}
exports.default = default_1;
