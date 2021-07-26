"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-jsdoc */
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const logger_1 = __importDefault(require("@fonos/logger"));
const grpc_1 = __importDefault(require("grpc"));
const trust_util_1 = require("./trust_util");
const grpc_interceptors_1 = __importDefault(require("@pionerlabs/grpc-interceptors"));
const grpc_ts_health_check_1 = require("grpc-ts-health-check");
const ENDPOINT = process.env.BINDADDR || "0.0.0.0:50052";
function run(srvInfList, middlewareList) {
    const healthCheckStatusMap = {
        "": grpc_ts_health_check_1.HealthCheckResponse.ServingStatus.SERVING
    };
    const grpcServer = new grpc_1.default.Server();
    // Adding health endpoint
    const grpcHealthCheck = new grpc_ts_health_check_1.GrpcHealthCheck(healthCheckStatusMap);
    grpcServer.addService(grpc_ts_health_check_1.HealthService, grpcHealthCheck);
    // Wrapped server
    const server = grpc_interceptors_1.default.serverProxy(grpcServer);
    logger_1.default.info(`@fonos/common service runner [starting @ ${ENDPOINT}, api = ${srvInfList[0].version}]`);
    if (middlewareList) {
        middlewareList.forEach((middleware) => {
            server.use(middleware.middlewareObj);
            logger_1.default.info(`@fonos/common service runner [added ${middleware.name} middleware]`);
        });
    }
    srvInfList.forEach((srvInf) => {
        server.addService(srvInf.service, srvInf.server);
        logger_1.default.info(`@fonos/common service runner [added ${srvInf.name} service]`);
    });
    server.bind(ENDPOINT, trust_util_1.getServerCredentials());
    server.start();
    logger_1.default.info("@fonos/common service runner [runner is online]");
}
exports.default = run;
