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
class PlayVerb extends verb_1.Verb {
    run(media, options = {}) {
        asserts_1.assertsValueIsPositive("offset", options.offset);
        asserts_1.assertsValueIsPositive("skip", options.skip);
        const playbackId = options.playbackId ? options.playbackId : objectid_1.default();
        // Renaming properties to match the API query parameters
        const opts = {
            media,
            offsetms: options.offset,
            skipms: options.skip,
            playbackId
        };
        return new Promise(async (resolve, reject) => {
            let token;
            try {
                await super.post(`channels/${this.request.sessionId}/play`, utils_1.objectToQString(opts));
                token = pubsub_js_1.default.subscribe(`PlaybackFinished.${this.request.sessionId}`, (type, data) => {
                    resolve(data);
                    pubsub_js_1.default.unsubscribe(token);
                });
            }
            catch (e) {
                reject(e);
                pubsub_js_1.default.unsubscribe(token);
            }
        });
    }
}
exports.default = PlayVerb;
