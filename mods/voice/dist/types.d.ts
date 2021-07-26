export interface VoiceRequest {
    accessKeyId: string;
    sessionToken: string;
    sessionId: string;
    dialbackEnpoint: string;
    number: string;
    callerId: string;
    callerNumber: string;
    selfEndpoint: string;
}
export interface ServerConfig {
    bind?: string;
    port?: number;
    base?: string;
    pathToFiles?: string;
}
export interface VoiceEventData {
    type: string;
    sessionId: string;
    data: any;
}
