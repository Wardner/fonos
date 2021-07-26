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
exports.getServerCredentials = exports.getClientCredentials = void 0;
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
const path_1 = __importDefault(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const atob_1 = __importDefault(require("atob"));
const grpc_1 = __importDefault(require("grpc"));
const prepCert = (cert) => Buffer.from(atob_1.default(cert), "utf-8");
let config = {};
try {
    config = JSON.parse(fs
        .readFileSync(path_1.default.join(os.homedir(), ".fonos", "config"))
        .toString("utf-8"));
}
catch (e) {
    logger_1.default.verbose("@fonos/common no config found");
}
const getServerCredentials = () => {
    try {
        return grpc_1.default.ServerCredentials.createSsl(prepCert(config.caCertificate), [
            {
                cert_chain: prepCert(config.serverCertificate),
                private_key: prepCert(config.serverKey)
            }
        ], true);
    }
    catch (e) {
        logger_1.default.warn("@fonos/common trust util [unable to load security certificates]");
        logger_1.default.warn("@fonos/common trust util [starting server in insecure mode]");
        return grpc_1.default.ServerCredentials.createInsecure();
    }
};
exports.getServerCredentials = getServerCredentials;
const getClientCredentials = (grpc) => process.env.ALLOW_INSECURE === "true"
    ? grpc.credentials.createInsecure()
    : grpc.credentials.createSsl();
exports.getClientCredentials = getClientCredentials;
