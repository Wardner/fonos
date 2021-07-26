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
const hangup_1 = __importDefault(require("./hangup/hangup"));
const unmute_1 = __importDefault(require("./unmute/unmute"));
const gather_1 = __importDefault(require("./gather/gather"));
const mute_1 = __importDefault(require("./mute/mute"));
const play_1 = __importDefault(require("./play/play"));
const record_1 = __importDefault(require("./record/record"));
const playback_1 = require("./playback/playback");
const asserts_1 = require("./asserts");
const pubsub_js_1 = __importDefault(require("pubsub-js"));
/**
 * @classdesc Use the VoiceResponse object, to construct advance Interactive
 * Voice Response (IVR) applications.
 *
 * @extends Verb
 * @example
 *
 * import { VoiceServer } from "@fonos/voice";
 *
 * async function handler (request, response) {
 *   await response.play("sound:hello-world");
 * }
 *
 * const voiceServer = new VoiceServer({base: '/voiceapp'})
 * voiceServer.listen(handler, { port: 3000 })
 */
class default_1 {
    /**
     * Constructs a new VoiceResponse object.
     *
     * @param {VoiceRequest} request - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(request) {
        this.request = request;
        this.plugins = {};
    }
    /**
     * Adds a tts or asr plugin. Only one type of plugin can be attached.
     *
     * @param plugin
     * @see GoogleTTS
     * @see GoogleASR
     */
    use(plugin) {
        this.plugins[plugin.getType()] = plugin;
    }
    /**
     * Plays an audio in the channel.
     *
     * @param {string} media - Sound name or uri with audio file
     * @param {PlayOptions} options - Optional parameters to alter the command's normal
     * behavior
     * @param {string} options.offset - Milliseconds to skip before playing. Only applies to the first URI if multiple media URIs are specified
     * @param {string} options.skip - Milliseconds to skip for forward/reverse operations
     * @param {string} options.playbackId - Playback identifier to use in Playback operations
     * @see Playback
     * @example
     *
     * async function handler (request, response) {
     *   await response.play("https://soundsserver:9000/sounds/hello-world.wav");
     * }
     */
    async play(media, options) {
        await new play_1.default(this.request).run(media, options);
    }
    /**
     * Converts a text into a sound and sends sound to media server. To use this verb, you must
     * first setup a TTS plugin such as MaryTTS, GoogleTTS, or AWS PollyTTS
     *
     * @param {string} text - Converts a text into a sound and sends sound to media server
     * @param {SayOptions} options - Optional parameters to alter the command's normal
     * behavior
     * @param {string} options.offset - Milliseconds to skip before playing
     * @param {string} options.skip - Milliseconds to skip for forward/reverse operations
     * @param {string} options.playbackId - Playback identifier to use in Playback operations
     * @see Play
     * @see Voice.use
     * @example
     *
     * async function handler (request, response) {
     *   response.use(new GoogleTTS())
     *   await response.say("Hello workd");   // Plays the sound using GoogleTTS's default values
     * }
     */
    async say(text, options) {
        asserts_1.assertPluginExist(this, "tts");
        const tts = this.plugins["tts"];
        // It should return the filename and the generated file location
        const result = await tts.synthetize(text, options);
        const media = `sound:${this.request.selfEndpoint}/tts/${result.filename}`;
        await new play_1.default(this.request).run(media, options);
    }
    /**
     * Waits for data entry from the user's keypad or from a speech provider.
     *
     * @param {GatherOptions} options - Options to select the maximum number of digits, final character, and timeout
     * @param {number} options.numDigits - Milliseconds to skip before playing. Only applies to the first URI if multiple media URIs are specified
     * @param {number} options.timeout - Milliseconds to wait before timeout. Defaults to 4000. Use zero for no timeout.
     * @param {string} options.finishOnKey - Optional last character to wait for. Defaults to '#'. It will not be included in the returned digits
     * @param {string} options.source - Where to listen as input source. This option accepts `dtmf` and `speech`. A speech provider must be configure
     * when including the `speech` option. You might inclue both with `dtmf,speech`. Defaults to `dtmf`
     * @note When including `speech` the default timeout is 10000 (10s).
     * @see SpeechProvider
     * @example
     *
     * async function handler (request, response) {
     *   const digits = await response.gather({numDigits: 3});
     *   console.log("digits: " + digits);
     * }
     */
    async gather(options) {
        let asr = null;
        if (options.source.includes("speech")) {
            asserts_1.assertPluginExist(this, "asr");
            asr = this.plugins["asr"];
        }
        return await new gather_1.default(this.request, asr).run(options);
    }
    /**
     * Returns a PlaybackControl control object.
     *
     * @param {string} playbackId - Playback identifier to use in Playback operations
     * @see Play
     * @example
     *
     * async function handler (request, response) {
     *   response.onDtmfReceived(async(digit) => {
     *      const control = response.playback("1234")
     *      digit === "3"
     *        ? await control.restart()
     *        : await control.forward()
     *   })
     *
     *   await response.play("https://soundsserver:9000/sounds/hello-world.wav", {
     *      playbackId: "1234"
     *   });
     * }
     */
    playback(playbackId) {
        return new playback_1.PlaybackControl(this.request, playbackId);
    }
    /**
     * Listens event publication.
     *
     * @param {Function} handler - Event handler
     * @example
     *
     * async function handler (request, response) {
     *   response.on("DtmfReceived", async(digit) => {
     *      const control = response.playback("1234")
     *      digit === "3"
     *        ? await control.restart()
     *        : await control.forward()
     *   })
     *
     *   await response.play("https://soundsserver:9000/sounds/hello-world.wav", {
     *      playbackId: "1234"
     *   });
     * }
     */
    async on(topic, handler) {
        pubsub_js_1.default.subscribe(`${topic}.${this.request.sessionId}`, (type, data) => {
            handler(data);
        });
    }
    /**
     * Mutes a channel.
     *
     * @param {MuteOptions} options - Indicate which direction of he communication to mute
     * @param {string} options.direction - Possible values are 'in', 'out', and 'both'
     * @see unmute
     * @example
     *
     * async function handler (request, response) {
     *   await response.mute();       // Will mute both directions
     * }
     */
    async mute(options) {
        await new mute_1.default(this.request).run(options);
    }
    /**
     * Unmutes a channel.
     *
     * @param {MuteOptions} options - Indicate which direction of he communication to unmute
     * @param {string} options.direction - Possible values are 'in', 'out', and 'both'
     * @see mute
     * @example
     *
     * async function handler (request, response) {
     *   await response.unmute({direction: "out"});       // Will unmute only the "out" direction
     * }
     */
    async unmute(options) {
        await new unmute_1.default(this.request).run(options);
    }
    /**
     * Terminates the communication channel.
     *
     * @example
     *
     * async function handler (request, response) {
     *   await response.hangup();
     * }
     */
    async hangup() {
        await new hangup_1.default(this.request).run();
    }
    /**
     * Records the current channel and uploads the file to the storage subsystem.
     *
     * @param {RecordOptions} options - optional parameters to alter the command's normal
     * behavior
     * @param {number} options.maxDuration - Maximum duration of the recording, in seconds. Use `0` for no limit
     * @param {number} options.maxSilence - Maximum duration of silence, in seconds. Use `0` for no limit
     * @param {boolean} options.beep - Play beep when recording begins
     * @param {string} options.finishOnKey - DTMF input to terminate recording
     * @return {Promise<RecordResult>} Returns useful information such as the duration of the recording, etc.
     * @example
     *
     * async function handler (request, response) {
     *   const result = await response.record({finishOnKey: "#"});
     *   console.log("recording result: " + JSON.stringify(result))     // recording result: { duration: 30 ...}
     * }
     */
    async record(options) {
        return await new record_1.default(this.request).run(options);
    }
}
exports.default = default_1;
