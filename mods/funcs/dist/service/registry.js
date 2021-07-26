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
const dockerode_1 = __importDefault(require("dockerode"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("@fonos/logger"));
const errors_1 = require("@fonos/errors");
const walk_1 = __importDefault(require("walk"));
const util_1 = require("util");
const sleep = util_1.promisify(setTimeout);
const getAuth = (request) => {
    logger_1.default.verbose(`@fonos/funcs image build [constructing auth obj for ${request.registry}]`);
    return {
        username: request.username,
        password: request.secret,
        serveraddress: "https://index.docker.io/v1"
    };
};
const ls = (pathToFunc) => {
    const walker = walk_1.default.walk(pathToFunc);
    const files = [];
    return new Promise((resolve, reject) => {
        walker.on("file", (root, stats, next) => {
            let base = root.substring(pathToFunc.length + 1);
            base = base.length > 0 ? base + "/" : "";
            const file = base + stats.name;
            logger_1.default.verbose(`@fonos/storage walk [base = ${base}, name = ${stats.name}]`);
            files.push(file);
            next();
        });
        walker.on("errors", (e) => {
            reject(e);
        });
        walker.on("end", () => {
            logger_1.default.verbose(`@fonos/storage walk [finished walking ${pathToFunc}]`);
            logger_1.default.verbose(`@fonos/funcs walk [ files = ${files}`);
            resolve(files);
        });
    });
};
// Push image function
async function default_1(request, serverStream) {
    const attempts = [1, 2, 3];
    let index;
    for (index in attempts) {
        // Sometime the image is not inmediatly available so we try a few times
        logger_1.default.verbose(`@fonos/funcs publish [waiting for files to be ready (try #${attempts[index]})`);
        logger_1.default.verbose(`@fonos/funcs registry [is file ${request.pathToFunc} present? ${fs_1.default.existsSync(request.pathToFunc)}`);
        if (fs_1.default.existsSync(request.pathToFunc)) {
            break;
        }
        else {
            // Wait for 10 seconds for minio to be ready
            await sleep(10000);
        }
    }
    const files = await ls(request.pathToFunc);
    serverStream.write("loaded function files");
    serverStream.write("connecting to the builder daemon");
    serverStream.write("sending files to builder daemon");
    serverStream.write("building image");
    serverStream.write("required function keys added");
    const docker = new dockerode_1.default({ socketPath: "/var/run/docker.sock" });
    try {
        const stream = await docker.buildImage({
            context: request.pathToFunc,
            src: files
        }, { t: request.image });
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
        });
        serverStream.write("build complete");
        const image = docker.getImage(request.image);
        serverStream.write("obtaining authentication handler");
        const auth = getAuth(request);
        const stream2 = await image.push({
            tag: "latest",
            authconfig: auth
        });
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream2, (err, res) => err ? reject(err) : resolve(res));
        });
    }
    catch (e) {
        logger_1.default.error(JSON.stringify(e));
        throw new errors_1.FonosError(`Unable to pulish image ${request.image} to registry ${request.registry}`);
    }
    finally {
        // Clean all the files
        fs_1.default.rmdirSync(request.pathToFunc, { recursive: true });
    }
}
exports.default = default_1;
