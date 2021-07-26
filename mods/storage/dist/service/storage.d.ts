import grpc from "grpc";
import { UploadObjectRequest, UploadObjectResponse, GetObjectURLRequest, GetObjectURLResponse } from "./protos/storage_pb";
import { IStorageServer, StorageService } from "./protos/storage_grpc_pb";
declare class StorageServer implements IStorageServer {
    uploadObject(call: grpc.ServerReadableStream<UploadObjectRequest>, callback: grpc.sendUnaryData<UploadObjectResponse>): Promise<void>;
    getObjectURL(call: grpc.ServerUnaryCall<GetObjectURLRequest>, callback: grpc.sendUnaryData<GetObjectURLResponse>): Promise<void>;
}
export { StorageServer as default, IStorageServer, StorageService };
