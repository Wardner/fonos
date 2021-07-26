"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const logger_1 = __importDefault(require("@fonos/logger"));
const grpc = __importStar(require("grpc"));
const grpc_ts_health_check_1 = require("grpc-ts-health-check");
const host = process.env.SERVICE_ADDRESS || "localhost";
const port = parseInt(process.env.SERVICE_PORT) || 50052;
const service = process.env.SERVICE_NAME || "";
function default_1() {
    const healthClient = new grpc_ts_health_check_1.HealthClient(`${host}:${port}`, grpc.credentials.createInsecure());
    const request = new grpc_ts_health_check_1.HealthCheckRequest();
    request.setService(service);
    healthClient.check(request, (error, response) => {
        if (error) {
            logger_1.default.error(`@fonos/common healthcheck fialed: ${error}`, error);
            process.exit(1);
        }
        else {
            logger_1.default.verbose(`@fonos/common healthcheck success [status: ${response.getStatus()}]`);
            process.exit(0);
        }
    });
}
exports.default = default_1;
