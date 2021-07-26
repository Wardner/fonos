import { Plugin } from "@fonos/common";
import { TTSPlugin, SynthResult } from "@fonos/tts";
import { MaryTTSConfig, MarySynthOptions } from "./types";
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
export default class MaryTTS extends Plugin implements TTSPlugin {
    serviceUrl: string;
    config: MaryTTSConfig;
    /**
     * Constructs a new MaryTTS object.
     *
     * @see module:tts:TTSPlugin
     * @param {DefaultConfig} config - Configuration of the marytts
     */
    constructor(config: MaryTTSConfig);
    /**
     * Init of the marytts constructor
     *
     * @param {DefaultConfig} config - Configuration of the marytts
     */
    init(config: MaryTTSConfig): void;
    /**
     * @inherit
     *
     * @param {string} text - Text that will be synthesized
     * @param {OptionsInterface} options - Options of the marytts, locale and voice
     * @return {Promise<String>}
     * For more information check the following link: http://marytts.phonetik.uni-muenchen.de:59125/documentation.html
     * WARNING: On windows the command "which" that sox library uses is not the same. In windows is "where" instead
     */
    synthetize(text: string, options?: MarySynthOptions): Promise<SynthResult>;
}
