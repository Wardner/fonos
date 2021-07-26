#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = __importDefault(require("./secrets"));
const secrets_grpc_pb_1 = require("./protos/secrets_grpc_pb");
const auth_1 = require("@fonos/auth");
const certs_1 = require("@fonos/certs");
const common_1 = require("@fonos/common");
const services = [
    {
        name: "secrets",
        version: "v1alpha1",
        service: secrets_grpc_pb_1.SecretsService,
        server: new secrets_1.default()
    }
];
const middleware = {
    name: "Authentication",
    middlewareObj: new auth_1.AuthMiddleware(certs_1.getSalt()).middleware
};
common_1.runServices(services, [middleware]);
