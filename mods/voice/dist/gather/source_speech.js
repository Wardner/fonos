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
const stream_1 = __importDefault(require("stream"));
const pubsub_js_1 = __importDefault(require("pubsub-js"));
const utils_1 = require("../utils");
const waitForSpeech = async (sessionId, options, verb, speechProvider) => new Promise(async (resolve, reject) => {
    let timer;
    let token = null;
    const speechTracker = speechProvider.createSpeechTracker(options);
    const readable = new stream_1.default.Readable({
        // The read logic is omitted since the data is pushed to the socket
        // outside of the script's control. However, the read() function
        // must be defined.
        read() { }
    });
    token = pubsub_js_1.default.subscribe(`media.${sessionId}`, (type, data) => {
        readable.push(data);
    });
    speechTracker
        .transcribe(readable)
        .then((result) => {
        if (timer)
            clearTimeout(timer);
        resolve(result.transcription);
        pubsub_js_1.default.unsubscribe(token);
        // TODO: Also tell Media Server to stop sending media
    })
        .catch((e) => {
        reject(e);
        pubsub_js_1.default.unsubscribe(token);
    });
    await verb.post(`events/user/SendExternalMedia`, utils_1.objectToQString({
        // WARNING: Harcoded value
        application: "mediacontroller"
    }));
    if (options.timeout > 0) {
        timer = setTimeout(() => {
            // Simply resolve an empty string
            resolve("");
            pubsub_js_1.default.unsubscribe(token);
            return;
        }, options.timeout);
    }
});
exports.default = waitForSpeech;
