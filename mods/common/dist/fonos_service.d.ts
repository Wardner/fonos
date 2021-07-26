import { ServiceOptions } from "./types";
export default class {
    ServiceClient: any;
    options: any;
    metadata: any;
    service: any;
    /**
     * Use the Options object to overwrite the service default configuration.
     * @typedef {Object} Options
     * @property {string} endpoint - The endpoint URI to send requests to.
     * The endpoint should be a string like '{serviceHost}:{servicePort}'.
     * @property {string} accessKeyId - your Fonos access key ID.
     * @property {string} accessKeySecret - your Fonos secret access key.
     * @property {string} bucket - The bucket to upload apps and media files.
     */
    /**
     * Constructs a service object.
     *
     * @param {Options} options - Overwrite for the service's defaults configuration.
     */
    constructor(ServiceClient: any, options?: ServiceOptions);
    init(grpc: {
        Metadata: new () => any;
    }): void;
    getOptions(): any;
    getService(): any;
    getMeta(): any;
}
