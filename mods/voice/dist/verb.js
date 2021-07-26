"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verb = void 0;
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
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("@fonos/logger"));
const auth = process.env.NODE_ENV != "production"
    ? {
        username: "admin",
        password: "changeit"
    }
    : null;
class Verb {
    constructor(request) {
        this.request = request;
    }
    getSelf() {
        return this;
    }
    getRequest() {
        return this.request;
    }
    async post(apiPath, queryParameters) {
        const url = `${this.getRequest().dialbackEnpoint}/ari/${apiPath}?${queryParameters}`;
        logger_1.default.verbose(`@fonos/voice posting [url: ${url}]`);
        return await axios_1.default({
            method: "post",
            url,
            auth,
            headers: {
                "X-Session-Token": this.request.sessionToken
            }
        });
    }
    async delete(apiPath, queryParameters) {
        const url = `${this.getRequest().dialbackEnpoint}/ari/${apiPath}?${queryParameters}`;
        logger_1.default.verbose(`@fonos/voice posting [url: ${url}]`);
        return await axios_1.default({
            method: "delete",
            url,
            auth,
            headers: {
                "X-Session-Token": this.request.sessionToken
            }
        });
    }
}
exports.Verb = Verb;
