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
const grpc_1 = __importDefault(require("grpc"));
const auth_pb_1 = __importDefault(require("../service/protos/auth_pb"));
const auth_grpc_pb_1 = require("../service/protos/auth_grpc_pb");
const common_1 = require("@fonos/common");
const svc = new auth_grpc_pb_1.AuthClient(process.env.APISERVER_ENDPOINT || "localhost:50052", common_1.getClientCredentials(grpc_1.default));
async function default_1(role, service) {
    return new Promise((resolve, reject) => {
        const req = new auth_pb_1.default.GetRoleRequest();
        req.setName(role);
        svc.getRole(req, (e, res) => {
            if (e)
                reject(e);
            resolve(res && res.getAccessList().includes(service));
        });
    });
}
exports.default = default_1;
