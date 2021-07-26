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
const objectid_1 = __importDefault(require("objectid"));
const verb_1 = require("../verb");
const utils_1 = require("../utils");
const asserts_1 = require("../asserts");
const pubsub_js_1 = __importDefault(require("pubsub-js"));
class RecordVerb extends verb_1.Verb {
    run(options = {}) {
        asserts_1.assertsFinishOnKeyIsChar(options.finishOnKey);
        asserts_1.assertsValueIsPositive("maxSilence", options.maxSilence);
        asserts_1.assertsValueIsPositive("maxDuration", options.maxDuration);
        // Renaming properties to match the API query parameters
        const opts = {
            format: "wav",
            name: objectid_1.default(),
            maxSilenceSeconds: options.maxSilence,
            maxDurationSeconds: options.maxDuration,
            beep: options.beep,
            terminateOn: encodeURIComponent(options.finishOnKey || "#")
        };
        return new Promise(async (resolve, reject) => {
            let tokenFinished = null;
            let tokenFailed = null;
            try {
                await super.post(`channels/${this.request.sessionId}/record`, utils_1.objectToQString(opts));
                tokenFinished = pubsub_js_1.default.subscribe(`RecordingFinished.${this.request.sessionId}`, (type, data) => {
                    resolve(data.data);
                    pubsub_js_1.default.unsubscribe(tokenFinished);
                    pubsub_js_1.default.unsubscribe(tokenFailed);
                });
                tokenFailed = pubsub_js_1.default.subscribe(`RecordingFailed.${this.request.sessionId}`, (type, data) => {
                    reject("recording failed: " + data.cause);
                    pubsub_js_1.default.unsubscribe(tokenFinished);
                    pubsub_js_1.default.unsubscribe(tokenFailed);
                });
            }
            catch (e) {
                reject(e);
                pubsub_js_1.default.unsubscribe(tokenFinished);
                pubsub_js_1.default.unsubscribe(tokenFailed);
            }
        });
    }
}
exports.default = RecordVerb;
