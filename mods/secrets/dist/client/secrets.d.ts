import { FonosService, ServiceOptions } from "@fonos/common";
import SecretPB from "../service/protos/secrets_pb";
import CommonPB from "../service/protos/common_pb";
import { CreateSecretRequest, CreateSecretResponse, GetSecretResponse, ListSecretRequest, ListSecretResponse } from "./types";
/**
 * @classdesc Use Fonos Secrets, a capability of Fonos Secrets Service,
 * to create and manage your secrets. Fonos Secrets requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk")
 * const secrets = new Fonos.Secrets()
 *
 * const request = {
 *    secretName: "Jenkins",
 *    secret: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 * };
 *
 * secrets.createSecret(request)
 * .then(result => {
 *   console.log(result) // returns the CreateDomainResponse interface
 * }).catch(e => console.error(e)); // an error occurred
 */
export default class Secrets extends FonosService {
    /**
     * Constructs a Secret Object.
     *
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
    /**
     * Creates a new Secret.
     *
     * @param {CreateSecretRequest} request - Request for the provision of
     * a new Secret
     * @param {string} request.name - Friendly name for the Secret
     * @param {string} request.secret - secret to be save
     * @return {Promise<CreateSecretResponse>}
     * @example
     *
     * const request = {
     *    secretName: "Jenkins",
     *    secret: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
     * };
     *
     * secrets.createSecret(request)
     * .then(result => {
     *   console.log(result) // returns the CreateDomainResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    createSecret(request: CreateSecretRequest): Promise<CreateSecretResponse>;
    /**
     * Get a Secret.
     *
     * @param {CreateSecretRequest} request - Request for the provision of
     * a new Secret
     * @param {string} request.name - Friendly name for the Secret
     * @param {string} request.secret - secret to be save
     * @return {Promise<CreateSecretResponse>}
     * @example
     *
     * const request = {
     *    secretName: "Jenkins",
     *    secret: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
     * };
     *
     * secrets.createSecret(request)
     * .then(result => {
     *   console.log(result) // returns the CreateDomainResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    getSecret(name: string): Promise<GetSecretResponse>;
    /**
     * List all user secrets.
     *
     * @param {ListSecretRequest} request - Request for the provision of
     * a new Secret
     * @param {string} request.name - Friendly name for the Secret
     * @param {string} request.secret - secret to be save
     * @return {Promise<ListSecretResponse>}
     * @example
     *
     * const request = {
     *    pageSize: 1,
     *    pageToken: 1
     * };
     *
     * secrets.listSecret(request)
     * .then(result => {
     *   console.log(result) // returns the CreateDomainResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    listSecret(request: ListSecretRequest): Promise<ListSecretResponse>;
    /**
     * Retrives a Secret using its reference.
     *
     * @param {string} request - Reference to Secret
     * @return {Promise<void>} The domain
     * @example
     *
     * secrets.deleteSecret("jenkins")
     * .then(() => {
     *   console.log("successful")      // returns the CreateGetResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    deleteSecret(name: string): Promise<void>;
}
export { SecretPB, CommonPB };
