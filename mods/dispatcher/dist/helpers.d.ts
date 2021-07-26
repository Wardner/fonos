import { AttachToEventsRequest, CallRequest } from "./types";
export declare const attachToEvents: (request: AttachToEventsRequest) => void;
export declare const sendCallRequest: (url: string, request: CallRequest) => Promise<void>;
