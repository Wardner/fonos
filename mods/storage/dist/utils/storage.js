"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToFS = exports.fsInstance = void 0;
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
const walk_1 = __importDefault(require("walk"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("@fonos/logger"));
const bucket_policy_1 = __importDefault(require("./bucket_policy"));
const splitPath = (p) => path_1.default.dirname(p).split(path_1.default.sep);
const fsInstance = () => {
    const Minio = require("minio");
    return new Minio.Client({
        endPoint: process.env.FS_HOST,
        port: parseInt(process.env.FS_PORT),
        useSSL: false,
        accessKey: process.env.FS_USERNAME,
        secretKey: process.env.FS_SECRET
    });
};
exports.fsInstance = fsInstance;
const uploadToFS = async (accessKeyId, bucket, pathToObject, object, metadata = {}) => new Promise((resolve, reject) => {
    const dirCount = splitPath(pathToObject).length;
    const baseDir = splitPath(pathToObject).slice(0, dirCount).join("/");
    const walker = walk_1.default.walk(pathToObject);
    walker.on("file", (root, stats, next) => {
        const filePath = root + "/" + stats.name;
        const destFilePath = root + "/" + (object || stats.name);
        const dest = `${accessKeyId}/` + destFilePath.substring(baseDir.length + 1);
        logger_1.default.verbose(`@fonos/storage upload fs [uploading ${stats.name} file to ${bucket}]`);
        exports.fsInstance().fPutObject(bucket, dest, filePath, metadata, (e) => {
            if (e) {
                logger_1.default.error(`@fonos/storage upload fs [${e}]`);
                reject(e);
            }
            else {
                logger_1.default.verbose(`@fonos/storage upload fs [finished uploading ${stats.name} file]`);
                next();
            }
        });
    });
    walker.on("errors", (root) => {
        reject(root);
    });
    walker.on("end", () => {
        logger_1.default.verbose(`@fonos/storage upload fs [finished uploading ${pathToObject}]`);
        resolve();
    });
});
exports.uploadToFS = uploadToFS;
async function default_1(bucket) {
    const fsConn = exports.fsInstance();
    const exists = await fsConn.bucketExists(bucket);
    if (!exists) {
        logger_1.default.log("verbose", `@fonos/core fsutils [Creating storage and setting policy bucket: ${bucket}]`);
        await fsConn.makeBucket(bucket, "us-west-1");
        await fsConn.setBucketPolicy(bucket, bucket_policy_1.default(bucket));
    }
}
exports.default = default_1;
