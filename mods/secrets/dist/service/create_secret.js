"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const secrets_pb_1 = require("./protos/secrets_pb");
const token_1 = __importDefault(require("./token"));
async function default_1(name, secret, accessKeyId) {
    const vault = require("node-vault")();
    const entityId = await token_1.default(accessKeyId);
    await vault.write(`secret/data/${entityId}/${name}`, {
        data: { value: secret }
    });
    const response = new secrets_pb_1.CreateSecretResponse();
    response.setName(name);
    return response;
}
exports.default = default_1;
