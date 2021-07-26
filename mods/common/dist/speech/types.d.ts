/// <reference types="node" />
import { Stream } from "stream";
export interface SpeechProvider {
    createSpeechTracker(options: unknown): SpeechTracker;
}
export interface SpeechResult {
    transcription: string;
}
export interface SpeechTracker {
    transcribe(stream: Stream): Promise<SpeechResult>;
}
