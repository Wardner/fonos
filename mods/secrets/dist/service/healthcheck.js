#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@fonos/common");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("@fonos/logger"));
// First checks the grpc health
common_1.healthcheck();
// Next, ensure vault is up
axios_1.default
    .get(`${process.env.VAULT_ADDR}/v1/sys/health`)
    .then((result) => {
    if (!result.data || result.data.sealed) {
        process.exit(1);
    }
    else {
        process.exit(0);
    }
})
    .catch((e) => {
    logger_1.default.error(e);
    process.exit(1);
});
