export interface CallRequest {
    accessKeyId: string;
    sessionToken: string;
    sessionId: string;
    dialbackEnpoint: string;
    number: string;
    callerId: string;
    callerNumber: string;
    selfEndpoint: string;
}
export interface AttachToEventsRequest {
    url: string;
    accessKeyId: string;
    sessionId: string;
    client: any;
    channel: any;
}
