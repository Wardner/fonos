import { FonosService, ServiceOptions } from "@fonos/common";
import StoragePB from "../service/protos/storage_pb";
import CommonPB from "../service/protos/common_pb";
import { GetObjectURLRequest, UploadObjectRequest, getObjectURLResponse, UploadObjectResponse } from "./types";
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
export default class Storage extends FonosService {
    /**
     * Constructs a new Storage object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
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
    uploadObject(request: UploadObjectRequest): Promise<UploadObjectResponse>;
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
    getObjectURL(request: GetObjectURLRequest): Promise<getObjectURLResponse>;
}
export { StoragePB, CommonPB };
