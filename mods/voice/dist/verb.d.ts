import { VoiceRequest } from "./types";
export declare class Verb {
    request: VoiceRequest;
    constructor(request: VoiceRequest);
    getSelf(): this;
    getRequest(): VoiceRequest;
    post(apiPath: string, queryParameters: string): Promise<import("axios").AxiosResponse<any>>;
    delete(apiPath: string, queryParameters: string): Promise<import("axios").AxiosResponse<any>>;
}
