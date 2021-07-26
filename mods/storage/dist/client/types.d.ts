export interface UploadObjectRequest {
    bucket: string;
    filename: string;
    metadata?: unknown;
    accessKeyId?: string;
}
export interface GetObjectURLRequest {
    bucket: string;
    filename: string;
    accessKeyId?: string;
}
export interface getObjectURLResponse {
    url: string;
}
export interface UploadObjectResponse {
    size: number;
}
