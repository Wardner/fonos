"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
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
const callmanager_1 = __importDefault(require("@fonos/callmanager"));
const storage_1 = __importDefault(require("@fonos/storage"));
const secrets_1 = __importDefault(require("@fonos/secrets"));
const providers_1 = __importDefault(require("@fonos/providers"));
const numbers_1 = __importDefault(require("@fonos/numbers"));
const domains_1 = __importDefault(require("@fonos/domains"));
const agents_1 = __importDefault(require("@fonos/agents"));
const funcs_1 = __importDefault(require("@fonos/funcs"));
const auth_1 = __importDefault(require("@fonos/auth"));
const logger_1 = require("@fonos/logger");
logger_1.mute();
const Fonos = {
    Secrets: secrets_1.default,
    Auth: auth_1.default,
    Agents: agents_1.default,
    CallManager: callmanager_1.default,
    Domains: domains_1.default,
    Funcs: funcs_1.default,
    Storage: storage_1.default,
    Numbers: numbers_1.default,
    Providers: providers_1.default
};
exports.default = Fonos;
// WARNING: Workaround to support commonjs clients
module.exports = Fonos;
