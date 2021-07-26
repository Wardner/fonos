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
const callmanager_pb_1 = require("./protos/callmanager_pb");
const nanoid_1 = require("nanoid");
const errors_1 = require("@fonos/errors");
const phone_1 = __importDefault(require("phone"));
async function default_1(request, channel, endpointInfo) {
    if (!request.getIgnoreE164Validation() &&
        phone_1.default(request.getFrom()).length === 0)
        throw new errors_1.FonosError("invalid e164 number");
    if (!request.getIgnoreE164Validation() && phone_1.default(request.getTo()).length === 0)
        throw new errors_1.FonosError("invalid e164 number");
    const response = new callmanager_pb_1.CallResponse();
    response.setRef(nanoid_1.nanoid());
    // Removing the "+" sign
    const from = request.getFrom().replace("+", "");
    const to = request.getTo().replace("+", "");
    const variables = !request.getWebhook()
        ? { DID_INFO: from }
        : { DID_INFO: from, WEBHOOK: request.getWebhook(), REF: response.getRef() };
    await channel.originate({
        context: endpointInfo.context,
        extension: endpointInfo.extension,
        endpoint: `PJSIP/${endpointInfo.trunk}/sip:${to}@${endpointInfo.domain}`,
        variables
    });
    return response;
}
exports.default = default_1;
