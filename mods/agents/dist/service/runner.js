#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = __importDefault(require("./agents"));
const agents_grpc_pb_1 = require("./protos/agents_grpc_pb");
const auth_1 = require("@fonos/auth");
const certs_1 = require("@fonos/certs");
const common_1 = require("@fonos/common");
const services = [
    {
        name: "agents",
        version: "v1alpha1",
        service: agents_grpc_pb_1.AgentsService,
        server: new agents_1.default()
    }
];
const middleware = {
    name: "authentication",
    middlewareObj: new auth_1.AuthMiddleware(certs_1.getSalt()).middleware
};
common_1.runServices(services, [middleware]);
