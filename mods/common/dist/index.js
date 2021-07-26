"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheck = exports.runServices = exports.getServerCredentials = exports.getClientCredentials = exports.Plugin = exports.FonosService = void 0;
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
const fonos_service_1 = __importDefault(require("./fonos_service"));
exports.FonosService = fonos_service_1.default;
const trust_util_1 = require("./trust_util");
Object.defineProperty(exports, "getClientCredentials", { enumerable: true, get: function () { return trust_util_1.getClientCredentials; } });
Object.defineProperty(exports, "getServerCredentials", { enumerable: true, get: function () { return trust_util_1.getServerCredentials; } });
const healthcheck_1 = __importDefault(require("./healthcheck"));
exports.healthcheck = healthcheck_1.default;
const service_runner_1 = __importDefault(require("./service_runner"));
exports.runServices = service_runner_1.default;
const plugin_1 = require("./speech/plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return plugin_1.Plugin; } });
