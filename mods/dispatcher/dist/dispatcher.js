#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const ari_client_1 = __importDefault(require("ari-client"));
const wait_port_1 = __importDefault(require("wait-port"));
const logger_1 = __importDefault(require("@fonos/logger"));
const events_handler_1 = __importDefault(require("./events_handler"));
// First try the short env but fallback to the cannonical env
const ariHost = process.env.ARI_INTERNAL_URL ||
    process.env.MS_ARI_INTERNAL_URL ||
    "http://localhost:8088";
const ariUsername = process.env.ARI_USERNAME || process.env.MS_ARI_USERNAME || "admin";
const ariSecret = process.env.ARI_SECRET || process.env.MS_ARI_SECRET || "changeit";
const connection = {
    host: ariHost.split("//")[1].split(":")[0],
    port: parseInt(ariHost.split("//")[1].split(":")[1])
};
wait_port_1.default(connection)
    .then((open) => {
    if (open) {
        ari_client_1.default.connect(ariHost, ariUsername, ariSecret, events_handler_1.default);
        return;
    }
    logger_1.default.info("The port did not open before the timeout...");
})
    .catch(console.error);
