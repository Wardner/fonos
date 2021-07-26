"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadServiceUtils = exports.getObjectServiceUtils = exports.isDirectory = void 0;
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../utils/constants");
const storage_pb_1 = __importDefault(require("../service/protos/storage_pb"));
const utils_1 = require("../utils/utils");
const isDirectory = (filename) => {
    return fs_1.default.lstatSync(filename).isDirectory();
};
exports.isDirectory = isDirectory;
const getObjectServiceUtils = (request) => {
    const objectUrlRequest = new storage_pb_1.default.GetObjectURLRequest();
    objectUrlRequest.setFilename(request.filename);
    objectUrlRequest.setBucket(utils_1.getBucketAsPB(request.bucket));
    objectUrlRequest.setAccessKeyId(request.accessKeyId);
    return objectUrlRequest;
};
exports.getObjectServiceUtils = getObjectServiceUtils;
const uploadServiceUtils = async (request, callService) => {
    const objectName = path_1.default.basename(request.filename);
    const readStream = fs_1.default.createReadStream(request.filename, {
        highWaterMark: constants_1.constants.HIGH_WATER_MARK
    });
    return new Promise((resolve, reject) => {
        readStream
            .on("data", (chunk) => {
            const uor = new storage_pb_1.default.UploadObjectRequest();
            uor.setChunks(Buffer.from(chunk));
            uor.setFilename(objectName);
            uor.setBucket(utils_1.getBucketAsPB(request.bucket));
            uor.setAccessKeyId(request.accessKeyId);
            if (request.metadata && Object.keys(request.metadata).length > 0) {
                const keys = Object.keys(request.metadata);
                keys.forEach((k) => uor.getMetadataMap().set(k, request.metadata[k]));
            }
            callService.write(uor);
        })
            .on("end", () => {
            resolve(fs_1.default.statSync(request.filename)["size"]);
            callService.end();
        })
            .on("error", (err) => {
            callService.end();
            reject(err);
        });
    });
};
exports.uploadServiceUtils = uploadServiceUtils;
