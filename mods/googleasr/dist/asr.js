"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSpeechTracker = void 0;
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
const tracker_1 = require("./tracker");
Object.defineProperty(exports, "GoogleSpeechTracker", { enumerable: true, get: function () { return tracker_1.GoogleSpeechTracker; } });
const common_1 = require("@fonos/common");
const defaultSpeechConfig = {
    languageCode: "en-US"
};
class GoogleASR extends common_1.Plugin {
    constructor() {
        super("asr", "googleasr");
    }
    createSpeechTracker(options) {
        const merge = require("deepmerge");
        const opts = merge(defaultSpeechConfig, options || {});
        return new tracker_1.GoogleSpeechTracker(opts);
    }
}
exports.default = GoogleASR;
// WARNING: Workaround to support commonjs clients
module.exports = GoogleASR;
module.exports.GoogleSpeechTracker = tracker_1.GoogleSpeechTracker;
