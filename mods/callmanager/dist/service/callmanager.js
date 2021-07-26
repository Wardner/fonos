"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallManagerServer = exports.default = void 0;
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
const core_1 = require("@fonos/core");
const ari_client_1 = __importDefault(require("ari-client"));
const call_1 = __importDefault(require("./call"));
const logger_1 = __importDefault(require("@fonos/logger"));
const errors_1 = require("@fonos/errors");
const getDomainByNumber = async (e164Number) => {
    await core_1.routr.connect();
    return await core_1.routr.getDomainUriFromNumber(e164Number);
};
const numberNotInList = (number) => `The number '${number}' is not assigned to one of your domains. Make sure the number exist and is assigned to a Domain`;
class CallManagerServer {
    async call(call, callback) {
        logger_1.default.verbose(`@core/callmanager call [from ${call.request.getFrom()}]`);
        const domain = await getDomainByNumber(call.request.getFrom());
        if (!domain) {
            callback(new errors_1.FonosError(numberNotInList(call.request.getFrom())), null);
            return;
        }
        logger_1.default.verbose(`@core/callmanager call [domain ${JSON.stringify(domain)}]`);
        const domainUri = domain.spec.context.domainUri;
        const accessKeyId = call.metadata.get("access_key_id")[0];
        const accessKeyIdDomain = domain.metadata.accessKeyId;
        if (accessKeyIdDomain != accessKeyId) {
            callback(new errors_1.FonosError(numberNotInList(call.request.getFrom())), null);
        }
        logger_1.default.verbose(`@core/callmanager call [ari url ${process.env.MS_ARI_INTERNAL_URL}]`);
        logger_1.default.verbose(`@core/callmanager call [ari username ${process.env.MS_ARI_USERNAME}]`);
        logger_1.default.verbose(`@core/callmanager call [endpoint ${process.env.MS_TRUNK}/${process.env.MS_CONTEXT}/${process.env.MS_EXTENSION}]`);
        try {
            const epInfo = {
                domain: domainUri,
                trunk: process.env.MS_TRUNK,
                context: process.env.MS_CONTEXT,
                extension: process.env.MS_EXTENSION
            };
            const conn = await ari_client_1.default.connect(process.env.MS_ARI_INTERNAL_URL, process.env.MS_ARI_USERNAME, process.env.MS_ARI_SECRET);
            const channel = conn.Channel();
            callback(null, await call_1.default(call.request, channel, epInfo));
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = CallManagerServer;
exports.CallManagerServer = CallManagerServer;
