#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const auth_grpc_pb_1 = require("./protos/auth_grpc_pb");
const common_1 = require("@fonos/common");
const logger_1 = __importDefault(require("@fonos/logger"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const auth_utils_1 = __importDefault(require("../utils/auth_utils"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const certs_1 = require("@fonos/certs");
const auth_middleware_1 = __importDefault(require("../auth_middleware"));
const authenticator = new auth_utils_1.default(new jwt_1.default());
app.get("/session_auth", async (req, res) => {
    const sessionToken = req.headers["x-session-token"];
    const result = await authenticator.validateToken({ accessToken: sessionToken }, certs_1.getSalt());
    if (!sessionToken || result.isValid === false) {
        res.status(401);
        res.send("Unauthorized");
        return;
    }
    res.status(200);
    res.send("Access granted");
});
// First starting the http 1.1 auth endpoint
app.listen(3000, () => {
    logger_1.default.info(`starting simple authentication service @ ${3000}`);
    const services = [
        {
            name: "auth",
            version: "v1alpha1",
            service: auth_grpc_pb_1.AuthService,
            server: new auth_1.default()
        }
    ];
    const middleware = {
        name: "authentication",
        middlewareObj: new auth_middleware_1.default(certs_1.getSalt(), null).middleware
    };
    common_1.runServices(services, [middleware]);
});
