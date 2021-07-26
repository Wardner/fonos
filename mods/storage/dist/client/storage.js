"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonPB = exports.StoragePB = void 0;
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const common_1 = require("@fonos/common");
const storage_grpc_pb_1 = require("../service/protos/storage_grpc_pb");
const storage_pb_1 = __importDefault(require("../service/protos/storage_pb"));
exports.StoragePB = storage_pb_1.default;
const common_pb_1 = __importDefault(require("../service/protos/common_pb"));
exports.CommonPB = common_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
const utils_1 = require("./utils");
/**
 * @classdesc Use Fonos Storage, a capability of Fonos Object Storage subsystem,
 * to upload, download, and delete objects.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk")
 * const storage = new Fonos.Storage()
 *
 * storage.uploadObject()
 * .then(result => {
 *    console.log(result)            // successful response
 * }).catch(e => console.error(e))   // an error occurred
 */
class Storage extends common_1.FonosService {
    /**
     * Constructs a new Storage object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options) {
        super(storage_grpc_pb_1.StorageClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
    /**
     * Upload an object to Fonos Object Storage subsystem.
     *
     * @param {UploadObjectRequest} request - Object with information about the origin and
     * destination of an object
     * @param {string} request.bucket - Bucket at the Storage system
     * @param {string} request.dir - Directory on the Storage system where your objec will be uploaded
     * @param {string} request.filename - Path to the object to be uploaded
     * @return {Promise<UploadObjectResponse>} localy accessible URL to the object
     * @throws if the path does not exist or if is a directory
     * @throws if the directory does not exist
     * @example
     *
     * const request = {
     *    filename: "/path/to/file",
     *    bucket: "apps",
     *    directory: "/"
     * }
     *
     * storage.uploadObject(request)
     * .then(() => {
     *   console.log(result)            // returns and empty Object
     * }).catch(e => console.error(e))  // an error occurred
     */
    async uploadObject(request) {
        if (utils_1.isDirectory(request.filename)) {
            throw new Error("Uploading a directory is not supported");
        }
        // Passing empty UploadObjectRequest only for initialization
        const uor = new storage_pb_1.default.UploadObjectRequest();
        const result = await this.getService().uploadObject().sendMessage(uor);
        const size = await utils_1.uploadServiceUtils(request, result.stream);
        return { size };
    }
    /**
     * Get Object URL.
     *
     * @param {GetObjectURLRequest} request - Object with information about the location and
     * and name of the requested object
     * @param {string} request.filename - The name of the object
     * save your file.
     * @param {string} request.accessKeyId - Optional access key id
     * @return {Promise<getObjectURLResponse>} localy accessible URL to the object
     * @throws if directory or object doesn't exist
     * @example
     *
     * const request = {
     *    filename: "object-name",
     *    bucket: "bucket-name"
     * }
     *
     * storage.getObjectURL(request)
     * .then(result => {
     *   console.log(result)
     * }).catch(e => console.error(e))  // an error occurred
     */
    async getObjectURL(request) {
        const result = await this.getService()
            .getObjectURL()
            .sendMessage(utils_1.getObjectServiceUtils(request));
        return { url: result.getUrl() };
    }
}
exports.default = Storage;
// WARNING: Workaround to support commonjs clients
module.exports = Storage;
