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
Object.defineProperty(exports, "__esModule", { value: true });
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
const certs_1 = require("@fonos/certs");
const trust_util_1 = require("./trust_util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// The ESM entry point was dropped due to a Webpack bug (https://github.com/webpack/webpack/issues/6584).
const merge = require("deepmerge");
const CONFIG_FILE = process.env.API_CONFIG_FILE ||
    path.join(require("os").homedir(), ".fonos", "config");
const getConfigFile = () => fs.readFileSync(CONFIG_FILE).toString().trim();
const defaultOptions = {
    endpoint: process.env.APISERVER_ENDPOINT || "localhost:50052",
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET
};
class default_1 {
    /**
     * Use the Options object to overwrite the service default configuration.
     * @typedef {Object} Options
     * @property {string} endpoint - The endpoint URI to send requests to.
     * The endpoint should be a string like '{serviceHost}:{servicePort}'.
     * @property {string} accessKeyId - your Fonos access key ID.
     * @property {string} accessKeySecret - your Fonos secret access key.
     * @property {string} bucket - The bucket to upload apps and media files.
     */
    /**
     * Constructs a service object.
     *
     * @param {Options} options - Overwrite for the service's defaults configuration.
     */
    constructor(ServiceClient, options = {}) {
        this.ServiceClient = ServiceClient;
        this.options = merge(defaultOptions, options);
    }
    init(grpc) {
        try {
            if (certs_1.configExist()) {
                this.options = merge(this.options, JSON.parse(getConfigFile()));
            }
        }
        catch (err) {
            throw new Error(`Malformed config file found at: ${CONFIG_FILE}`);
        }
        if (!this.options.accessKeyId || !this.options.accessKeySecret) {
            throw new Error("Not valid credentials found");
        }
        this.metadata = new grpc.Metadata();
        this.metadata.add("access_key_id", this.options.accessKeyId);
        this.metadata.add("access_key_secret", this.options.accessKeySecret);
        this.service = new this.ServiceClient(this.options.endpoint, trust_util_1.getClientCredentials(grpc));
    }
    getOptions() {
        return this.options;
    }
    getService() {
        return this.service;
    }
    getMeta() {
        return this.metadata;
    }
}
exports.default = default_1;
