export interface Domain {
    ref: string;
    name: string;
    domainUri: string;
    egressRule: string;
    egressNumberRef: string;
    accessDeny: string[];
    accessAllow: string[];
    createTime: string;
    updateTime: string;
}
export interface CreateDomainRequest {
    ref?: string;
    name: string;
    domainUri: string;
    egressRule?: string;
    egressNumberRef?: string;
    accessDeny?: string[];
    accessAllow?: string[];
}
export interface CreateDomainResponse {
    ref: string;
    name: string;
    domainUri: string;
    egressRule?: string;
    egressNumberRef?: string;
    accessDeny?: string[];
    accessAllow?: string[];
    createTime: string;
    updateTime: string;
}
export interface GetDomainResponse {
    ref: string;
    name: string;
    domainUri: string;
    egressRule?: string;
    egressNumberRef?: string;
    accessDeny?: string[];
    accessAllow?: string[];
    createTime?: string;
    updateTime?: string;
}
export interface UpdateDomainRequest {
    ref: string;
    name?: string;
    domainUri?: string;
    egressRule?: string;
    egressNumberRef?: string;
    accessDeny?: string[];
    accessAllow?: string[];
}
export interface UpdateDomainResponse {
    ref: string;
}
export interface ListDomainsRequest {
    pageSize?: number;
    pageToken?: string;
    view?: number;
}
export interface ListDomainsResponse {
    nextPageToken: string;
    domains: Domain[];
}
export interface DeleteDomainResponse {
    ref: string;
}
