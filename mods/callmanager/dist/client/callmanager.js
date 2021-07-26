"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallManagerPB = void 0;
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
const common_1 = require("@fonos/common");
const callmanager_grpc_pb_1 = require("../service/protos/callmanager_grpc_pb");
const callmanager_pb_1 = __importDefault(require("../service/protos/callmanager_pb"));
exports.CallManagerPB = callmanager_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
/**
 * @classdesc Use Fonos CallManager, a capability of Fonos Systems Manager,
 * to initiate and monitor automated calls. Fonos CallManager requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk")
 * const callManager = new Fonos.CallManager()
 *
 * callManager.call({
 *   from: "9102104343",
 *   to: "17853178070"
 *   app: "default"
 * })
 * .then(console.log)        // successful response
 * .catch(console.error)   // an error occurred
 */
class CallManager extends common_1.FonosService {
    /**
     * Constructs a new CallManager Object.
     *
     * @see module:core:FonosService
     */
    constructor(options) {
        super(callmanager_grpc_pb_1.CallManagerClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
    /**
     * Call method.
     *
     * @param {CallRequest} request - Call request options
     * @param {string} request.from - Number you are calling from. You must have this Number configured in your account
     * @param {string} request.to - The callee
     * @param {string} request.webhook - Url of the application that will handle the call.
     * If none is provided it will use the webook setup in the Number
     * @param {string} request.ignoreE164Validation - If enabled it will accept any input in the from and to
     * @return {Promise<CallResponse>} - call results
     * @throws if the from number doesn't exist
     * @throws if could not connect to the underline services
     * @example
     *
     * callManager.call({
     *   from: "+19102104343",
     *   to: "+17853178070",
     *   webhook: "https://voiceapps.acme.com/myvoiceapp"
     * })
     * .then(console.log)         // successful response
     * .catch(console.error);     // an error occurred
     */
    async call(request) {
        const r = new callmanager_pb_1.default.CallRequest();
        r.setFrom(request.from);
        r.setTo(request.to);
        r.setWebhook(request.webhook);
        r.setIgnoreE164Validation(request.ignoreE164Validation);
        const p = await super.getService().call().sendMessage(r);
        return {
            ref: p.getRef()
        };
    }
}
exports.default = CallManager;
// WARNING: Workaround for support to commonjs clients
module.exports = CallManager;
module.exports.CallManagerPB = callmanager_pb_1.default;
