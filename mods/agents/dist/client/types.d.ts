export interface Agent {
    ref: string;
    name: string;
    username: string;
    secret: string;
    domains: string[];
    privacy: string;
    createTime: string;
    updateTime: string;
}
export interface CreateAgentRequest {
    name: string;
    username: string;
    secret: string;
    domains: string[];
    privacy?: string;
}
export interface CreateAgentResponse {
    ref: string;
    name: string;
    username: string;
    secret: string;
    domains: string[];
    privacy: string;
    createTime: string;
    updateTime: string;
}
export interface GetAgentResponse {
    ref: string;
    name: string;
    username: string;
    secret: string;
    domains: string[];
    privacy: string;
    createTime: string;
    updateTime: string;
}
export interface UpdateAgentRequest {
    ref: string;
    name?: string;
    secret?: string;
    privacy?: string;
}
export interface UpdateAgentResponse {
    ref: string;
}
export interface ListAgentsRequest {
    pageSize?: number;
    pageToken?: string;
    view?: number;
}
export interface ListAgentsResponse {
    nextPageToken: string;
    agents: Agent[];
}
export interface DeleteAgentResponse {
    ref: string;
}
