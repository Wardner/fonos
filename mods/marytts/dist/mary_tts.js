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
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const common_1 = require("@fonos/common");
const tts_1 = require("@fonos/tts");
const logger_1 = __importDefault(require("@fonos/logger"));
/**
 * @classdesc The default TTS engine in a Fonos deployment.
 *
 * @extends Plugin
 * @example
 *
 * const MaryTTS = require("@fonos/marytts");
 *
 * new MaryTTS().synthetize("Hello world")
 *  .then((result) => console.log("path: " + result.pathToFile))
 *  .catch(console.err);
 */
class MaryTTS extends common_1.Plugin {
    /**
     * Constructs a new MaryTTS object.
     *
     * @see module:tts:TTSPlugin
     * @param {DefaultConfig} config - Configuration of the marytts
     */
    constructor(config) {
        super("tts", "marytts");
        this.config = config;
        this.config.path = this.config.path ? this.config.path : "/tmp";
        this.init(this.config);
    }
    /**
     * Init of the marytts constructor
     *
     * @param {DefaultConfig} config - Configuration of the marytts
     */
    init(config) {
        const q = "INPUT_TYPE=TEXT&AUDIO=WAVE_FILE&OUTPUT_TYPE=AUDIO";
        this.serviceUrl = `${this.config.url}?${q}`;
        logger_1.default.debug(`@fonos/tts.MaryTTS.constructor [initializing with config: ${JSON.stringify(config)}]`);
    }
    /**
     * @inherit
     *
     * @param {string} text - Text that will be synthesized
     * @param {OptionsInterface} options - Options of the marytts, locale and voice
     * @return {Promise<String>}
     * For more information check the following link: http://marytts.phonetik.uni-muenchen.de:59125/documentation.html
     * WARNING: On windows the command "which" that sox library uses is not the same. In windows is "where" instead
     */
    async synthetize(text, options = { locale: "EN_US" }) {
        const filename = tts_1.computeFilename(text, options, "sln16");
        const pathToFile = path_1.default.join(this.config.path, filename);
        logger_1.default.verbose(`@fonos/tts.MaryTTS.synthesize [text: ${text}, options: ${JSON.stringify(options)}]`);
        return new Promise((resolve, reject) => {
            const q = tts_1.optionsToQueryString(options);
            const query = q ? q.toUpperCase() : "";
            let headers = null;
            if (this.config.accessKeyId && this.config.accessKeySecret) {
                headers = {
                    "X-Session-Token": this.config.accessKeySecret
                };
            }
            logger_1.default.silly(`@fonos/tts.MaryTTS.synthesize [headers: ${JSON.stringify(headers)}]`);
            logger_1.default.verbose(`@fonos/tts.MaryTTS.synthesize [query: ${query}]`);
            https_1.default.get(`${this.serviceUrl}&INPUT_TEXT=${encodeURI(text)}&${query}`, {
                headers
            }, (response) => {
                const { statusCode } = response;
                if (statusCode !== 200) {
                    reject(new Error(`Request failed with status code: ${statusCode}`));
                    return;
                }
                response.pipe(fs_1.default.createWriteStream(pathToFile));
                resolve({ filename, pathToFile });
            });
        });
    }
}
exports.default = MaryTTS;
// WARNING: Workaround to support commonjs clients
module.exports = MaryTTS;
