declare enum View {
    BASIC = 0,
    STANDARD = 1,
    FULL = 2
}
export interface Number {
    ref: string;
    providerRef: string;
    e164Number: string;
    ingressInfo: {
        webhook: string;
    };
    aorLink: string;
    createTime: string;
    updateTime: string;
}
export interface ListNumbersResponse {
    nextPageToken: string;
    numbers: number[];
}
export interface CreateNumberRequest {
    ref?: string;
    providerRef: string;
    e164Number: string;
    ingressInfo?: {
        webhook: string;
    };
    aorLink?: string;
}
export interface UpdateNumberRequest {
    ref: string;
    aorLink?: string;
    ingressInfo?: {
        webhook: string;
    };
}
export interface UpdateNumberResponse {
    ref: string;
}
export interface ListNumbersRequest {
    pageSize: number;
    pageToken: string;
    view: View;
}
export interface DeleteNumberResponse {
    ref: string;
}
export interface CreateNumberResponse {
    ref: string;
}
export interface GetNumberResponse {
    ref: string;
    providerRef: string;
    e164Number: string;
    ingressInfo: {
        webhook: string;
    };
    aorLink: string;
    createTime: string;
    updateTime: string;
}
export interface GetIngressInfoRequest {
    e164Number: string;
}
export interface GetIngressInfoResponse {
    accessKeyId: string;
    webhook: string;
}
export {};
