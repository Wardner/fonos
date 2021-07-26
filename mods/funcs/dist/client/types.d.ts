import FuncPB from "../service/protos/funcs_pb";
declare enum View {
    BASIC = 0,
    STANDARD = 1,
    FULL = 2
}
export interface DeployFuncRequest {
    name: string;
    path: string;
    schedule?: string;
    limits?: {
        memory: undefined | string;
        cpu: undefined | string;
    };
    requests?: {
        memory: undefined | string;
        cpu: undefined | string;
    };
}
export interface GetFuncRequest {
    name: string;
}
export interface GetFuncRequest {
    name: string;
}
export interface GetFuncResponse {
    name: string;
    image: string;
    invocationCount: number;
    replicas: number;
    availableReplicas: number;
    schedule: string;
}
export interface DeleteFuncRequest {
    name: string;
}
export interface DeleteFuncResponse {
    name: string;
}
export interface Func {
    name: string;
    image: string;
    invocationCount: number;
    replicas: number;
    availableReplicas: number;
    schedule?: string;
}
export interface ListFuncsRequest {
    pageSize: number;
    pageToken: string;
    view: View;
}
export interface ListFuncsResponse {
    nextPageToken: string;
    funcs: Func[];
}
export interface FuncParameters {
    request: FuncPB.DeployFuncRequest;
    accessKeyId: string;
}
export interface GetFuncLogsRequest {
    name: string;
    since?: string;
    tail?: number;
    follow?: boolean;
}
export {};
