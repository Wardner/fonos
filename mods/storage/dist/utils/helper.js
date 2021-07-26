"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUncompressUpload = exports.handleCompressUpload = void 0;
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
const storage_pb_1 = require("../service/protos/storage_pb");
const files_1 = require("./files");
const storage_1 = require("./storage");
const logger_1 = __importDefault(require("@fonos/logger"));
const handleCompressUpload = async (accessKeyId, object, bucket, fileSize) => {
    const response = new storage_pb_1.UploadObjectResponse();
    const nameWithoutExt = object.split(".")[0];
    response.setSize(fileSize);
    logger_1.default.verbose(`@fonos/storage helper [extrating ${object} into /tmp]`);
    await files_1.extract(`/tmp/${object}`, "/tmp");
    logger_1.default.verbose(`@fonos/storage helper [uploading ${nameWithoutExt} to bucket ${bucket}]`);
    await storage_1.uploadToFS(accessKeyId, bucket, `/tmp/${nameWithoutExt}`);
    logger_1.default.verbose(`@fonos/storage helper [removing /tmp/${nameWithoutExt}]`);
    files_1.removeDirSync(`/tmp/${nameWithoutExt}`);
    return response;
};
exports.handleCompressUpload = handleCompressUpload;
const handleUncompressUpload = async (accessKeyId, object, bucket, fileSize) => {
    const response = new storage_pb_1.UploadObjectResponse();
    response.setSize(fileSize);
    await storage_1.uploadToFS(accessKeyId, bucket, `/tmp/${object}`, object);
    return response;
};
exports.handleUncompressUpload = handleUncompressUpload;
