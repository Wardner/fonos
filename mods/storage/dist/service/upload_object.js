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
const fs_1 = __importDefault(require("fs"));
const storage_pb_1 = require("./protos/storage_pb");
const core_1 = require("@fonos/core");
const files_1 = require("../utils/files");
const helper_1 = require("../utils/helper");
const utils_1 = require("../utils/utils");
const objectid = require("objectid");
async function default_1(call, callback) {
    const tmpName = objectid();
    const writeStream = fs_1.default.createWriteStream(`/tmp/${tmpName}`);
    let object;
    let bucket;
    let accessKeyId = core_1.getAccessKeyId(call);
    call.on("error", (err) => {
        logger_1.default.log("error", `@fonos/storage upload [an error ocurred while uploading object ${object} to bucket '${bucket}']`);
        logger_1.default.log("error", err);
    });
    call.on("end", () => writeStream.end());
    call.on("data", (request) => {
        const chunk = request.getChunks();
        if (chunk.length === 0)
            return;
        writeStream.write(Buffer.alloc(chunk.length, chunk));
        if (!object && request.getFilename()) {
            object = request.getFilename();
            bucket = utils_1.getBucketAsString(request.getBucket());
            if (request.getAccessKeyId() &&
                request.getBucket() === storage_pb_1.UploadObjectRequest.Bucket.PUBLIC) {
                accessKeyId = request.getAccessKeyId();
            }
            logger_1.default.debug(`@fonos/storage upload [started uploading object ${object} into "${bucket}" bucket]`);
        }
        logger_1.default.log("verbose", `@fonos/storage upload [received chunk(${chunk.length}) for ${object}]`);
    });
    writeStream.on("finish", async () => {
        try {
            const fileSize = files_1.getFilesizeInBytes(`/tmp/${tmpName}`);
            fs_1.default.renameSync(`/tmp/${tmpName}`, `/tmp/${object}`);
            logger_1.default.verbose(`@fonos/storage upload [moved ${tmpName} into ${object} (final name)]`);
            logger_1.default.verbose(`@fonos/storage upload [uploading file to storage backend (s3)]`);
            const response = files_1.isCompressFile(object)
                ? await helper_1.handleCompressUpload(accessKeyId, object, bucket, fileSize)
                : await helper_1.handleUncompressUpload(accessKeyId, object, bucket, fileSize);
            logger_1.default.verbose(`@fonos/storage upload [removing tmp file /tmp/${object}]`);
            fs_1.default.unlink(`/tmp/${object}`, () => callback(null, response));
        }
        catch (e) {
            logger_1.default.log("error", `@fonos/storage upload [${e}]`);
            callback(utils_1.handleError(e, bucket));
        }
    });
}
exports.default = default_1;
