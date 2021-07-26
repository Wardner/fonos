import { GoogleSpeechTracker } from "./tracker";
import { GoogleSpeechConfig } from "./types";
import { Plugin, SpeechProvider, SpeechTracker } from "@fonos/common";
declare class GoogleASR extends Plugin implements SpeechProvider {
    constructor();
    createSpeechTracker(options: GoogleSpeechConfig): SpeechTracker;
}
export default GoogleASR;
export { GoogleSpeechTracker, GoogleSpeechConfig };
