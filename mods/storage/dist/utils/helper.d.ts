import { UploadObjectResponse } from "../service/protos/storage_pb";
export declare const handleCompressUpload: (accessKeyId: string, object: string, bucket: string, fileSize: number) => Promise<UploadObjectResponse>;
export declare const handleUncompressUpload: (accessKeyId: string, object: string, bucket: string, fileSize: number) => Promise<UploadObjectResponse>;
