export interface GatherOptions {
    finishOnKey?: string;
    numDigits?: any;
    timeout?: number;
    source?: "dtmf" | "speech" | "dtmf,speech" | "speech,dtmf";
}
