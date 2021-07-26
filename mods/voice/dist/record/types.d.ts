export interface RecordOptions {
    maxDuration?: number;
    maxSilence?: number;
    beep?: boolean;
    finishOnKey?: string;
}
export interface RecordResult {
    duration: number;
    format: string;
    name: string;
    silenceDuration: number;
    talkingDuration: number;
}
