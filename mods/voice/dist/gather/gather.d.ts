import { SpeechProvider } from "@fonos/common";
import { VoiceRequest } from "../types";
import { Verb } from "../verb";
import { GatherOptions } from "./types";
export default class GatherVerb extends Verb {
    speechProvider: SpeechProvider;
    constructor(request: VoiceRequest, speechProvider?: SpeechProvider);
    run(opts: GatherOptions): Promise<string>;
}
export { GatherOptions };
