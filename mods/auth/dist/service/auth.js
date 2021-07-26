"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.default = void 0;
const auth_pb_1 = require("./protos/auth_pb");
const auth_grpc_pb_1 = require("./protos/auth_grpc_pb");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return auth_grpc_pb_1.AuthService; } });
const errors_1 = require("@fonos/errors");
const certs_1 = require("@fonos/certs");
const logger_1 = __importDefault(require("@fonos/logger"));
const auth_utils_1 = __importDefault(require("../utils/auth_utils"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const authenticator = new auth_utils_1.default(new jwt_1.default());
const rbac = require(process.env.AUTH_RBAC || "/home/fonos/rbac.json");
class AuthServer {
    async validateToken(call, callback) {
        const result = await authenticator.validateToken({ accessToken: call.request.getToken() }, certs_1.getSalt());
        const validateTokenResponse = new auth_pb_1.ValidateTokenResponse();
        validateTokenResponse.setValid(result.isValid);
        callback(null, validateTokenResponse);
    }
    async createToken(call, callback) {
        // WARNING: We need to validate the token and verify
        // it has permissions to create token since the auth module
        // doesnt pass thru the auth middleware.
        logger_1.default.verbose(`@fonos/auth creating token [accessKeyId is ${call.request.getAccessKeyId()}]`);
        const result = await authenticator.createToken(call.request.getAccessKeyId(), certs_1.AUTH_ISS, call.request.getRoleName(), certs_1.getSalt(), call.request.getExpiration() || "30d");
        const response = new auth_pb_1.CreateTokenResponse();
        response.setToken(result.accessToken);
        callback(null, response);
    }
    async createNoAccessToken(call, callback) {
        // WARNING: We need to validate the token and verify
        // it has permissions to create token since the auth module
        // doesnt pass thru the auth middleware.
        logger_1.default.verbose(`@fonos/auth creating no access token [accessKeyId is ${call.request.getAccessKeyId()}]`);
        const result = await authenticator.createToken(call.request.getAccessKeyId(), certs_1.AUTH_ISS, 
        // WARNING: Harcoded value
        "NO_ACCESS", certs_1.getSalt(), "1d");
        const response = new auth_pb_1.CreateTokenResponse();
        response.setToken(result.accessToken);
        callback(null, response);
    }
    async getRole(call, callback) {
        try {
            const rawRole = rbac.filter((r) => r.name === call.request.getName())[0];
            if (rawRole) {
                const role = new auth_pb_1.Role();
                role.setAccessList(rawRole.access);
                role.setName(rawRole.name);
                role.setDescription(rawRole.description);
                callback(null, role);
                return;
            }
            callback(new errors_1.FonosError("Role not found", errors_1.ErrorCodes.NOT_FOUND), null);
        }
        catch (e) {
            callback(new errors_1.FonosError(e, errors_1.ErrorCodes.UNKNOWN), null);
        }
    }
}
exports.default = AuthServer;
