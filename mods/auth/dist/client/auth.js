"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPB = void 0;
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
const auth_grpc_pb_1 = require("../service/protos/auth_grpc_pb");
const auth_pb_1 = __importDefault(require("../service/protos/auth_pb"));
exports.AuthPB = auth_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
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
class Auths extends common_1.FonosService {
    /**
     * Constructs a new Auth object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options) {
        super(auth_grpc_pb_1.AuthClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
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
    async createToken(request) {
        const req = new auth_pb_1.default.CreateTokenRequest();
        req.setAccessKeyId(request.accessKeyId);
        req.setRoleName(request.roleName);
        const res = await super.getService().createToken().sendMessage(req);
        return {
            token: res.getToken()
        };
    }
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
    async createNoAccessToken(request) {
        const req = new auth_pb_1.default.CreateTokenRequest();
        req.setAccessKeyId(request.accessKeyId);
        const res = await super.getService().createNoAccessToken().sendMessage(req);
        return {
            token: res.getToken()
        };
    }
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
    async validateToken(request) {
        const req = new auth_pb_1.default.ValidateTokenRequest();
        req.setToken(request.token);
        const res = await super.getService().validateToken().sendMessage(req);
        return res.getValid();
    }
}
exports.default = Auths;
// WARNING: Workaround for support to commonjs clients
module.exports = Auths;
module.exports.AuthPB = auth_pb_1.default;
