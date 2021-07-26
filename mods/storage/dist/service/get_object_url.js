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
const logger_1 = __importDefault(require("@fonos/logger"));
const grpc_1 = __importDefault(require("grpc"));
const errors_1 = require("@fonos/errors");
const storage_1 = require("../utils/storage");
async function default_1(accessKeyId, bucket, filename) {
    logger_1.default.log("debug", `@fonos/core getObjectURL [bucket: ${bucket}, filename: ${filename}, accessKeId: ${accessKeyId}}]`);
    return new Promise((resolve, reject) => {
        storage_1.fsInstance().statObject(bucket, `${accessKeyId}/${filename}`, (err) => {
            if (err) {
                reject(new errors_1.FonosError(`${err.message}: filename ${accessKeyId}/${filename} in bucket '${bucket}'`, grpc_1.default.status.NOT_FOUND));
                return;
            }
            resolve(`http://${process.env.FS_HOST}:${process.env.FS_PORT}/${bucket}/${accessKeyId}/${filename}`);
        });
    });
}
exports.default = default_1;
