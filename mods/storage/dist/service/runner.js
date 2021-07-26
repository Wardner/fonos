#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("./storage"));
const storage_grpc_pb_1 = require("./protos/storage_grpc_pb");
const auth_1 = require("@fonos/auth");
const certs_1 = require("@fonos/certs");
const common_1 = require("@fonos/common");
const services = [
    {
        name: "storage",
        version: "v1alpha1",
        service: storage_grpc_pb_1.StorageService,
        server: new storage_1.default()
    }
];
const middleware = {
    name: "authentication",
    middlewareObj: new auth_1.AuthMiddleware(certs_1.getSalt()).middleware
};
common_1.runServices(services, [middleware]);
