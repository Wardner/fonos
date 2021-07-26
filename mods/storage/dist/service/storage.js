"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.default = void 0;
const get_object_url_1 = __importDefault(require("./get_object_url"));
const upload_object_1 = __importDefault(require("./upload_object"));
const storage_pb_1 = require("./protos/storage_pb");
const storage_grpc_pb_1 = require("./protos/storage_grpc_pb");
Object.defineProperty(exports, "StorageService", { enumerable: true, get: function () { return storage_grpc_pb_1.StorageService; } });
const core_1 = require("@fonos/core");
const getBucketName = (bucket) => {
    switch (bucket) {
        case storage_pb_1.GetObjectURLRequest.Bucket.APPS:
            return "apps";
        case storage_pb_1.GetObjectURLRequest.Bucket.RECORDINGS:
            return "recordings";
        case storage_pb_1.GetObjectURLRequest.Bucket.PUBLIC:
            return "public";
    }
};
class StorageServer {
    async uploadObject(call, callback) {
        try {
            await upload_object_1.default(call, callback);
        }
        catch (e) {
            callback(e, null);
        }
    }
    async getObjectURL(call, callback) {
        const bucket = getBucketName(call.request.getBucket());
        let accessKeyId = core_1.getAccessKeyId(call);
        if (call.request.getAccessKeyId() &&
            call.request.getBucket() === storage_pb_1.GetObjectURLRequest.Bucket.PUBLIC) {
            accessKeyId = call.request.getAccessKeyId();
        }
        try {
            const url = await get_object_url_1.default(accessKeyId, bucket, call.request.getFilename());
            const response = new storage_pb_1.GetObjectURLResponse();
            response.setUrl(url);
            callback(null, response);
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = StorageServer;
