import { FonosError } from "@fonos/errors";
import { UploadObjectRequest } from "../service/protos/storage_pb";
export declare const mapToObj: (map: {
    toArray: () => {
        (): any;
        new (): any;
        length: number;
        reduce: {
            (arg0: (e: any[]) => {}): any;
            new (): any;
        };
    };
}) => any;
export declare const handleError: (err: {
    code: any;
    message: string;
}, bucket: string) => FonosError;
export declare const getBucketAsString: (bucket: UploadObjectRequest.Bucket) => string;
export declare const getBucketAsPB: (bucket: string) => UploadObjectRequest.Bucket;
