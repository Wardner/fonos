import { Plugin } from "@fonos/common";
import { TTSPlugin, SynthResult } from "@fonos/tts";
import { GoogleTTSConfig, SynthOptions } from "./types";
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
declare class GoogleTTS extends Plugin implements TTSPlugin {
    config: GoogleTTSConfig;
    /**
     * Constructs a new GoogleTTS object.
     *
     * @see module:tts:AbstractTTS
     */
    constructor(config: GoogleTTSConfig);
    /**
     * @inherit
     */
    synthetize(text: string, options?: SynthOptions): Promise<SynthResult>;
}
export default GoogleTTS;
