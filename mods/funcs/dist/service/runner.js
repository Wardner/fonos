#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@fonos/auth");
const common_1 = require("@fonos/common");
const certs_1 = require("@fonos/certs");
const funcs_grpc_pb_1 = require("./protos/funcs_grpc_pb");
const funcs_1 = __importDefault(require("./funcs"));
const logger_1 = __importDefault(require("@fonos/logger"));
if (!process.env.PUBLIC_URL) {
    logger_1.default.error("Didn't find environment variable PUBLIC_URL while is required");
    process.exit(1);
}
const services = [
    {
        name: "Funcs",
        version: "v1alpha1",
        service: funcs_grpc_pb_1.FuncsService,
        server: new funcs_1.default()
    }
];
const middleware = {
    name: "Authentication",
    middlewareObj: new auth_1.AuthMiddleware(certs_1.getSalt()).middleware
};
common_1.runServices(services, [middleware]);
