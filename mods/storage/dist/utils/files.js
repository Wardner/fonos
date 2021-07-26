"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDirSync = exports.isCompressFile = exports.getFilesizeInBytes = exports.extract = void 0;
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
const tar_1 = __importDefault(require("tar"));
const logger_1 = __importDefault(require("@fonos/logger"));
const errors_1 = require("@fonos/errors");
const extract = (source, target) => tar_1.default.extract({ file: source, cwd: target });
exports.extract = extract;
const getFilesizeInBytes = (filename) => {
    if (!fs_1.default.existsSync(filename)) {
        throw new errors_1.FonosError(`file ${filename} does not exist`);
    }
    return fs_1.default.statSync(filename)["size"];
};
exports.getFilesizeInBytes = getFilesizeInBytes;
const isCompressFile = (object) => object.endsWith(".zip") ||
    object.endsWith(".tar") ||
    object.endsWith(".tgz") ||
    object.endsWith(".tar.gz");
exports.isCompressFile = isCompressFile;
const removeDirSync = (pathToFile) => {
    if (fs_1.default.existsSync(pathToFile)) {
        const files = fs_1.default.readdirSync(pathToFile);
        if (files.length > 0) {
            files.forEach(function (filename) {
                if (fs_1.default.statSync(pathToFile + "/" + filename).isDirectory()) {
                    exports.removeDirSync(pathToFile + "/" + filename);
                }
                else {
                    fs_1.default.unlinkSync(pathToFile + "/" + filename);
                }
            });
            fs_1.default.rmdirSync(pathToFile);
        }
        else {
            fs_1.default.rmdirSync(pathToFile);
        }
    }
    else {
        logger_1.default.log("warn", "Directory path not found.");
    }
};
exports.removeDirSync = removeDirSync;
