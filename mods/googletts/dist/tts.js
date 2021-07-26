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
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
const common_1 = require("@fonos/common");
const tts_1 = require("@fonos/tts");
const logger_1 = __importDefault(require("@fonos/logger"));
const defaultVoice = { languageCode: "en-US", ssmlGender: "NEUTRAL" };
/**
 * @classdesc Optional TTS engine for Fonos.
 *
 * @extends AbstractTTS
 * @example
 * const GoogleTTS = require("@fonos/googletts");
 *
 * new GoogleTTS().synthetize("Hello world")
 *  .then((result) => console.log("path: " + result.pathToFile))
 *  .catch(console.error);
 */
class GoogleTTS extends common_1.Plugin {
    /**
     * Constructs a new GoogleTTS object.
     *
     * @see module:tts:AbstractTTS
     */
    constructor(config) {
        super("tts", "googletts");
        this.config = config;
        this.config.path = this.config.path ? this.config.path : "/tmp";
    }
    /**
     * @inherit
     */
    async synthetize(text, options = {}) {
        const client = new text_to_speech_1.default.TextToSpeechClient(this.config);
        // TODO: The file extension should be set based on the sample rate
        // For example, if we set the sample rate to 16K, then the extension needs to be
        // snl16, for 8K => sln, etc...
        const filename = tts_1.computeFilename(text, options, "sln24");
        const pathToFile = path_1.default.join(this.config.path, filename);
        logger_1.default.log("debug", `@fonos/tts.GoogleTTS.synthesize [text: ${text}, options: ${JSON.stringify(options)}]`);
        const merge = require("deepmerge");
        const voice = merge(defaultVoice, options || {});
        const request = {
            voice,
            input: { text },
            audioConfig: { audioEncoding: "LINEAR16" }
        };
        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util_1.default.promisify(fs_1.default.writeFile);
        await writeFile(pathToFile, response.audioContent, "binary");
        return { filename, pathToFile };
    }
}
exports.default = GoogleTTS;
// WARNING: Workaround to support commonjs clients
module.exports = GoogleTTS;
