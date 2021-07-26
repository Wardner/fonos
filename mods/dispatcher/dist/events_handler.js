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
const auth_1 = __importDefault(require("@fonos/auth"));
const numbers_1 = __importDefault(require("@fonos/numbers"));
const logger_1 = __importDefault(require("@fonos/logger"));
const helpers_1 = require("./helpers");
// First try the short env but fallback to the cannonical version
const dialbackEnpoint = process.env.ARI_EXTERNAL_URL ||
    process.env.MS_ARI_EXTERNAL_URL ||
    "http://localhost:8088";
function default_1(err, client) {
    if (err)
        throw err;
    client.on("StasisStart", async (event, channel) => {
        let didInfo;
        try {
            didInfo = await channel.getChannelVar({
                channelId: channel.id,
                variable: "DID_INFO"
            });
        }
        catch (e) {
            if (e.message && e.message.includes("variable was not found")) {
                logger_1.default.verbose(`@fonos/dispatcher DID_INFO variable not found [ignoring event]`);
            }
            return;
        }
        const auth = new auth_1.default();
        const numbers = new numbers_1.default();
        const sessionId = event.channel.id;
        const ingressInfo = await numbers.getIngressInfo({
            e164Number: didInfo.value
        });
        let newwebhook;
        let webhook = ingressInfo.webhook;
        try {
            // If this variable exist it then we need overwrite the webhook
            newwebhook = await channel.getChannelVar({
                channelId: channel.id,
                variable: "WEBHOOK"
            });
        }
        catch (e) {
            console.log('ERROR DEL CATCH: ', e);
            // Nothing further needs to happen
        }
        if (newwebhook.value) {
            webhook = newwebhook.value;
            logger_1.default.info("DENTRO DEL IF");
        }
        logger_1.default.verbose(`@fonos/dispatcher statis start [channelId = ${channel.id}]`);
        logger_1.default.verbose(`@fonos/dispatcher statis start [e164Number = ${didInfo.value}]`);
        logger_1.default.verbose(`@fonos/dispatcher statis start [webhook = ${webhook}, accessKeyId = ${ingressInfo.accessKeyId}]`);
        const access = await auth.createNoAccessToken({
            accessKeyId: ingressInfo.accessKeyId
        });
        const request = {
            accessKeyId: ingressInfo.accessKeyId,
            sessionToken: access.token,
            // Dialback request must travel thru the reverse proxy first
            dialbackEnpoint,
            sessionId,
            number: didInfo.value,
            callerId: event.channel.caller.name,
            callerNumber: event.channel.caller.number,
            selfEndpoint: webhook
        };
        logger_1.default.verbose(`@fonos/dispatcher sending request to mediacontroller [request = ${JSON.stringify(request)}]`);
        helpers_1.attachToEvents({
            url: webhook,
            accessKeyId: ingressInfo.accessKeyId,
            sessionId,
            client,
            channel
        });
        await helpers_1.sendCallRequest(webhook, request);
    });
    client.on("StasisEnd", (event, channel) => {
        logger_1.default.debug(`@fonos/dispatcher statis end [channelId ${channel.id}]`);
    });
    client.start("mediacontroller");
}
exports.default = default_1;
