"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBucketAsPB = exports.getBucketAsString = exports.handleError = exports.mapToObj = void 0;
const errors_1 = require("@fonos/errors");
const storage_pb_1 = require("../service/protos/storage_pb");
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
const constants_1 = require("./constants");
const storage_1 = require("../client/storage");
const mapToObj = (map) => {
    if (!map || map.toArray().length === 0)
        return {};
    return map.toArray().reduce((e) => {
        const r = {};
        r[e[0]] = e[1];
        return r;
    });
};
exports.mapToObj = mapToObj;
const handleError = (err, bucket) => {
    switch (err.code) {
        case "NoSuchBucket":
            return new errors_1.FonosFailedPrecondition(`${err.message} -> bucket: ${bucket}`);
        case "TAR_BAD_ARCHIVE":
            return new errors_1.FonosError(err.message, grpc_1.default.status.DATA_LOSS);
        default:
            return new errors_1.FonosError(err.message, grpc_1.default.status.UNKNOWN);
    }
};
exports.handleError = handleError;
const getBucketAsString = (bucket) => {
    switch (bucket) {
        case storage_pb_1.UploadObjectRequest.Bucket.FUNCS:
            return constants_1.constants.FUNCS_BUCKET;
        case storage_pb_1.UploadObjectRequest.Bucket.APPS:
            return constants_1.constants.APPS_BUCKET;
        case storage_pb_1.UploadObjectRequest.Bucket.RECORDINGS:
            return constants_1.constants.RECORDINGS_BUCKET;
        case storage_pb_1.UploadObjectRequest.Bucket.PUBLIC:
            return constants_1.constants.PUBLIC_BUCKET;
    }
};
exports.getBucketAsString = getBucketAsString;
const getBucketAsPB = (bucket) => {
    switch (bucket) {
        case constants_1.constants.APPS_BUCKET:
            return storage_1.StoragePB.GetObjectURLRequest.Bucket.APPS;
        case constants_1.constants.FUNCS_BUCKET:
            return storage_1.StoragePB.GetObjectURLRequest.Bucket.FUNCS;
        case constants_1.constants.RECORDINGS_BUCKET:
            return storage_1.StoragePB.GetObjectURLRequest.Bucket.RECORDINGS;
        case constants_1.constants.PUBLIC_BUCKET:
            return storage_1.StoragePB.GetObjectURLRequest.Bucket.PUBLIC;
        default:
            throw new errors_1.FonosError(`Bucket ${bucket} is not a valid one`);
    }
};
exports.getBucketAsPB = getBucketAsPB;
