export interface CallRequest {
    from: string;
    to: string;
    webhook?: string;
    ignoreE164Validation?: boolean;
}
export interface CallResponse {
    ref: string;
}
export interface EndpointInfo {
    domain: string;
    trunk: string;
    context: string;
    extension: string;
}
