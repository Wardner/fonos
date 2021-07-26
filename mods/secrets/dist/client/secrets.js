"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonPB = exports.SecretPB = void 0;
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
const secrets_grpc_pb_1 = require("../service/protos/secrets_grpc_pb");
const secrets_pb_1 = __importDefault(require("../service/protos/secrets_pb"));
exports.SecretPB = secrets_pb_1.default;
const common_pb_1 = __importDefault(require("../service/protos/common_pb"));
exports.CommonPB = common_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
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
class Secrets extends common_1.FonosService {
    /**
     * Constructs a Secret Object.
     *
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options) {
        super(secrets_grpc_pb_1.SecretsClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
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
    async createSecret(request) {
        const secret = new secrets_pb_1.default.Secret();
        secret.setName(request.name);
        secret.setSecret(request.secret);
        const req = new secrets_pb_1.default.CreateSecretRequest();
        req.setName(secret.getName());
        req.setSecret(secret.getSecret());
        const secretFromVault = await super
            .getService()
            .createSecret()
            .sendMessage(req);
        return {
            name: secretFromVault.getName()
        };
    }
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
    async getSecret(name) {
        const req = new secrets_pb_1.default.GetSecretRequest();
        req.setName(name);
        const secretFromVault = await super
            .getService()
            .getSecret()
            .sendMessage(req);
        return {
            name: secretFromVault.getName(),
            secret: secretFromVault.getSecret()
        };
    }
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
    async listSecret(request) {
        const req = new secrets_pb_1.default.ListSecretIdRequest();
        req.setPageSize(request.pageSize);
        req.setPageToken(request.pageToken);
        const paginatedList = await this.getService()
            .listSecretsId()
            .sendMessage(req);
        return {
            nextPageToken: paginatedList.getNextPageToken(),
            secrets: paginatedList.getSecretsList().map((secret) => {
                return {
                    name: secret.getName()
                };
            })
        };
    }
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
    async deleteSecret(name) {
        const req = new secrets_pb_1.default.DeleteSecretRequest();
        req.setName(name);
        await super.getService().deleteSecret().sendMessage(req);
    }
}
exports.default = Secrets;
// WARNING: Workaround for support to commonjs clients
module.exports = Secrets;
module.exports.SecretPB = secrets_pb_1.default;
module.exports.CommonPB = common_pb_1.default;
