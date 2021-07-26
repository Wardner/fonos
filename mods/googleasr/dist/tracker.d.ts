/// <reference types="node" />
import { GoogleSpeechConfig, TrackerConfig } from "./types";
import { SpeechTracker, SpeechResult } from "@fonos/common";
import { Stream } from "stream";
export declare class GoogleSpeechTracker implements SpeechTracker {
    client: any;
    config: TrackerConfig;
    constructor(config: GoogleSpeechConfig);
    transcribe(stream: Stream): Promise<SpeechResult>;
}
