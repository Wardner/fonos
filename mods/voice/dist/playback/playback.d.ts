import { Verb } from "../verb";
import { VoiceRequest } from "../types";
export declare class PlaybackControl extends Verb {
    playbackId: string;
    constructor(request: VoiceRequest, playbackId: string);
    private operation;
    restart(): Promise<void>;
    pause(): Promise<void>;
    unpause(): Promise<void>;
    forward(): Promise<void>;
}
