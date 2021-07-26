import StoragePB from "../service/protos/storage_pb";
import { UploadObjectRequest, GetObjectURLRequest } from "./types";
interface CallService {
    write(storageObject: StoragePB.UploadObjectRequest): any;
    end(): any;
}
export declare const isDirectory: (filename: string) => boolean;
export declare const getObjectServiceUtils: (request: GetObjectURLRequest) => StoragePB.GetObjectURLRequest;
export declare const uploadServiceUtils: (request: UploadObjectRequest, callService: CallService) => Promise<number>;
export {};
