export interface CreateSecretRequest {
    name: string;
    secret: string;
}
export interface CreateSecretResponse {
    name: string;
}
export interface GetSecretResponse {
    name: string;
    secret: string;
}
export interface ListSecretRequest {
    pageSize: number;
    pageToken: string;
}
export interface ListSecretResponse {
    secrets: Secret[];
    nextPageToken: string;
}
export interface Secret {
    name: string;
}
