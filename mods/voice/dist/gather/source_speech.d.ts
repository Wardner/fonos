import { GatherOptions } from "./types";
import { SpeechProvider } from "@fonos/common";
declare const waitForSpeech: (sessionId: string, options: GatherOptions, verb: any, speechProvider: SpeechProvider) => Promise<string>;
export default waitForSpeech;
