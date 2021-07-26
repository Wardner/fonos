import { GatherOptions } from "./gather/gather";
import { MuteOptions } from "./mute/mute";
import { PlayOptions } from "./play/play";
import { RecordOptions, RecordResult } from "./record/record";
import { PlaybackControl } from "./playback/playback";
import { SayOptions } from "./say/types";
import { VoiceRequest } from "./types";
import { Plugin } from "@fonos/common";
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
export default class {
    request: VoiceRequest;
    plugins: {};
    /**
     * Constructs a new VoiceResponse object.
     *
     * @param {VoiceRequest} request - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(request: VoiceRequest);
    /**
     * Adds a tts or asr plugin. Only one type of plugin can be attached.
     *
     * @param plugin
     * @see GoogleTTS
     * @see GoogleASR
     */
    use(plugin: Plugin): void;
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
    play(media: string, options?: PlayOptions): Promise<void>;
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
    say(text: string, options?: SayOptions): Promise<void>;
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
    gather(options: GatherOptions): Promise<string>;
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
    playback(playbackId: string): PlaybackControl;
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
    on(topic: string, handler: Function): Promise<void>;
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
    mute(options?: MuteOptions): Promise<void>;
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
    unmute(options?: MuteOptions): Promise<void>;
    /**
     * Terminates the communication channel.
     *
     * @example
     *
     * async function handler (request, response) {
     *   await response.hangup();
     * }
     */
    hangup(): Promise<void>;
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
    record(options: RecordOptions): Promise<RecordResult>;
}
