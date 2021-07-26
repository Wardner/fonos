import { FonosService, ServiceOptions } from "@fonos/common";
import AuthPB from "../service/protos/auth_pb";
import { CreateTokenRequest, CreateTokenResponse, ValidateTokenRequest } from "./types";
/**
 * @classdesc Use Fonos Auth, a capability of Fonos,
 * to validate and create short life tokens.
 *
 * @extends FonosService
 * @example
 *
 * const request = {
 *   accessKeyId: "603693c0afaa1a080000000e",
 *   roleName: "ROLE",
 * };
 *
 * auth.createToken(request)
 * .then(console.log)       // returns an object with the token
 * .catch(console.error);   // an error occurred
 */
export default class Auths extends FonosService {
    /**
     * Constructs a new Auth object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
    /**
     * Creates a short-life token. The client must have role allowed to create
     * tokens.
     *
     * @param {CreateTokenRequest} request - Request to create a new token
     * @param {string} request.accessKeyId - Path to the function
     * @param {string} request.roleName - Unique function name
     * @return {Promise<CreateTokenResponse>}
     * @example
     *
     * const Fonos = require("@fonos/sdk");
     * const auth = new Fonos.Auth();
     *
     * const request = {
     *   accessKeyId: "603693c0afaa1a080000000e",
     *   roleName: "ROLE",
     * };
     *
     * auth.createToken(request)
     *  .then(console.log)       // returns an object with the token
     *  .catch(console.error);   // an error occurred
     */
    createToken(request: CreateTokenRequest): Promise<CreateTokenResponse>;
    /**
     * Creates a short-life token meant only to serve as a signature. This token will
     * only be useful to sign a request.
     *
     * @param {CreateTokenRequest} request - Request to create a new signature token
     * @param {string} request.accessKeyId - Path to the function
     * @return {Promise<CreateTokenResponse>}
     * @example
     *
     * const Fonos = require("@fonos/sdk");
     * const auth = new Fonos.Auth();
     *
     * const request = {
     *   accessKeyId: "603693c0afaa1a080000000e",
     * };
     *
     * auth.createNoAccessToken(request)
     *  .then(console.log)       // returns an object with the token
     *  .catch(console.error);   // an error occurred
     */
    createNoAccessToken(request: CreateTokenRequest): Promise<CreateTokenResponse>;
    /**
     * Checks if a give token was issue by the system.
     *
     * @param {CreateTokValidateTokenRequestenRequest} request - Request to verify the validity of a token
     * @param {string} request.token - Path to the function.
     * @return {Promise<boolean>}
     * @example
     *
     * const Fonos = require("@fonos/sdk");
     * const auth = new Fonos.Auth();
     *
     * const request = {
     *   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     * };
     *
     * auth.validateToken(request)
     *  .then(console.log)       // returns `true` or `false`
     *  .catch(console.error);   // an error occurred
     */
    validateToken(request: ValidateTokenRequest): Promise<boolean>;
}
export { AuthPB };
