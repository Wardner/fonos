"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmute = exports.mute = exports.default = void 0;
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
const winston_1 = __importDefault(require("winston"));
const fluent_logger_1 = __importDefault(require("fluent-logger"));
const fluentTransport = fluent_logger_1.default.support.winstonTransport();
const fluent = new fluentTransport(`${process.env.LOG_OPT_TAG_PREFIX}.${process.env.COMPOSE_PROJECT_NAME}.mediacontroller`, {
    host: process.env.LOGS_DRIVER_HOST,
    port: process.env.LOGS_DRIVER_PORT,
    timeout: 3.0,
    requireAckResponse: true
});
const level = process.env.NODE_ENV !== "production" ? "verbose" : "info";
const transports = process.env.NODE_ENV !== "production"
    ? [new winston_1.default.transports.Console()]
    : [fluent];
const format = process.env.NODE_ENV !== "production"
    ? winston_1.default.format.simple()
    : winston_1.default.format.json();
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), format),
    levels: winston_1.default.config.npm.levels,
    transports,
    level
});
exports.default = logger;
logger.on("finish", () => {
    fluent.sender.end("end", {}, () => { });
});
const mute = () => logger.transports.forEach((t) => (t.silent = true));
exports.mute = mute;
const unmute = () => logger.transports.forEach((t) => (t.silent = false));
exports.unmute = unmute;
