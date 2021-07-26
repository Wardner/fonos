"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_1 = __importDefault(require("grpc"));
const auth_utils_1 = __importDefault(require("./utils/auth_utils"));
const jwt_1 = __importDefault(require("./utils/jwt"));
const role_has_access_1 = __importDefault(require("./utils/role_has_access"));
const logger_1 = __importDefault(require("@fonos/logger"));
const WHITELIST = process.env.AUTH_ACCESS_WHITELIST
    ? process.env.AUTH_ACCESS_WHITELIST.split(",")
    : [];
class AuthMiddleware {
    constructor(privateKey, whitelist = []) {
        this.middleware = async (ctx, next, errorCb) => {
            const pathRequest = ctx.service.path;
            logger_1.default.verbose(`@fonos/logger middleware [request.path = ${pathRequest}]`);
            if (this.whitelist.includes(pathRequest)) {
                next();
                return;
            }
            const jwtHandler = new auth_utils_1.default(new jwt_1.default());
            try {
                if (!ctx.call.metadata._internal_repr.access_key_id ||
                    !ctx.call.metadata._internal_repr.access_key_secret) {
                    errorCb({
                        code: grpc_1.default.status.UNAUTHENTICATED,
                        message: "UNAUTHENTICATED"
                    });
                    return;
                }
                const accessKeyId = ctx.call.metadata._internal_repr.access_key_id.toString();
                const accessKeySecret = ctx.call.metadata._internal_repr.access_key_secret.toString();
                jwtHandler
                    .validateToken({ accessToken: accessKeySecret }, this.privateKey)
                    .then(async (result) => {
                    if (result.isValid) {
                        if (result.data.accessKeyId != accessKeyId)
                            errorCb({
                                code: grpc_1.default.status.UNAUTHENTICATED,
                                // TODO: Improve error message
                                message: "UNAUTHENTICATED"
                            });
                        const hasAccess = await role_has_access_1.default(result.data.role, pathRequest);
                        if (hasAccess) {
                            await next();
                        }
                        else {
                            errorCb({
                                code: grpc_1.default.status.PERMISSION_DENIED,
                                // TODO: Improve error message
                                message: "PERMISSION_DENIED"
                            });
                        }
                    }
                    else {
                        errorCb({
                            code: grpc_1.default.status.UNAUTHENTICATED,
                            // TODO: Improve error message
                            message: "UNAUTHENTICATED"
                        });
                    }
                });
            }
            catch (e) {
                errorCb({
                    code: grpc_1.default.status.INTERNAL,
                    message: e
                });
            }
        };
        this.privateKey = privateKey;
        this.whitelist = whitelist || WHITELIST;
    }
}
exports.default = AuthMiddleware;
