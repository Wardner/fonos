"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawFuncToFunc = exports.buildFaasDeployParameters = exports.getBuildDir = exports.getImageName = exports.getFuncName = exports.copyFuncAtTmp = exports.cleanupTmpDirSync = exports.validateFunc = exports.assertValidSchedule = exports.assertValidFuncName = exports.buildDeployFuncRequest = void 0;
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
const funcs_pb_1 = __importStar(require("../service/protos/funcs_pb"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tar_1 = __importDefault(require("tar"));
const errors_1 = require("@fonos/errors");
const cron_validate_1 = __importDefault(require("cron-validate"));
const auth_1 = __importDefault(require("./auth"));
const buildDeployFuncRequest = (request) => {
    const limits = new funcs_pb_1.default.Resource();
    const requests = new funcs_pb_1.default.Resource();
    if (request.limits) {
        limits.setCpu(request.limits.cpu);
        limits.setMemory(request.limits.memory);
    }
    if (request.requests) {
        requests.setCpu(request.requests.cpu);
        requests.setMemory(request.requests.memory);
    }
    const dfr = new funcs_pb_1.default.DeployFuncRequest();
    dfr.setName(request.name);
    dfr.setLimits(limits);
    dfr.setRequests(requests);
    dfr.setSchedule(request.schedule);
    return dfr;
};
exports.buildDeployFuncRequest = buildDeployFuncRequest;
const assertValidFuncName = (name) => {
    if (/[^a-z0-9_]/.test(name))
        throw new errors_1.FonosError("function name must be a-z0-9_", errors_1.ErrorCodes.INVALID_ARGUMENT);
};
exports.assertValidFuncName = assertValidFuncName;
const assertValidSchedule = (schedule) => {
    if (schedule && !cron_validate_1.default(schedule).isValid()) {
        throw new errors_1.FonosError("function schedule is not valid (invalid cron expression)", errors_1.ErrorCodes.INVALID_ARGUMENT);
    }
};
exports.assertValidSchedule = assertValidSchedule;
// @deprecated
const validateFunc = (pathToFunc) => {
    const packagePath = path_1.default.join(pathToFunc, "package.json");
    let pInfo;
    // Expects an existing valid package.json
    const packageInfo = (p) => JSON.parse(`${fs_extra_1.default.readFileSync(p)}`);
    try {
        pInfo = packageInfo(packagePath);
    }
    catch (err) {
        throw new Error(`Unable to obtain function info. Ensure package.json exists in '${pathToFunc}', and that is well formatted`);
    }
    if (!pInfo.main)
        throw new Error('Missing "main" entry at package.json');
    const mainScript = `${pathToFunc}/${pInfo.main}`;
    if (!fs_extra_1.default.existsSync(mainScript))
        throw new Error(`Cannot find main script at "${mainScript}"`);
    if (!fs_extra_1.default.existsSync(pathToFunc) || !fs_extra_1.default.lstatSync(pathToFunc).isDirectory()) {
        throw new Error(`${pathToFunc} does not exist or is not a directory`);
    }
    if (!fs_extra_1.default.existsSync(packagePath)) {
        throw new Error(`not package.json found in ${pathToFunc}`);
    }
};
exports.validateFunc = validateFunc;
const cleanupTmpDirSync = (dirName) => {
    if (fs_extra_1.default.existsSync(`/tmp/${dirName}`))
        fs_extra_1.default.rmdirSync(`/tmp/${dirName}`, { recursive: true });
    if (fs_extra_1.default.existsSync(`/tmp/${dirName}.tgz`))
        fs_extra_1.default.unlinkSync(`/tmp/${dirName}.tgz`);
};
exports.cleanupTmpDirSync = cleanupTmpDirSync;
const copyFuncAtTmp = async (funcPath, dirName) => {
    await fs_extra_1.default.copy(funcPath, `/tmp/${dirName}`, {
        filter: (currentPath) => !currentPath.includes("node_modules")
    });
    await tar_1.default.create({ file: `/tmp/${dirName}.tgz`, cwd: "/tmp" }, [dirName]);
};
exports.copyFuncAtTmp = copyFuncAtTmp;
const getFuncName = (accessKeyId, name) => `fn${accessKeyId}${name}`;
exports.getFuncName = getFuncName;
const getImageName = (accessKeyId, name) => `${process.env.DOCKER_REGISTRY_ORG}/fn${accessKeyId}${name}`;
exports.getImageName = getImageName;
const getBuildDir = (accessKeyId, funcName) => process.env.NODE_ENV === "dev"
    ? "/tmp/example"
    : path_1.default.join(process.env.FUNCS_WORKDIR, accessKeyId, funcName);
exports.getBuildDir = getBuildDir;
const buildFaasDeployParameters = async (params) => {
    const endpoint = process.env.PUBLIC_URL.replace("http://", "").replace("https://", "");
    const parameters = {
        service: exports.getFuncName(params.accessKeyId, params.request.getName()),
        image: exports.getImageName(params.accessKeyId, params.request.getName()),
        limits: {
            memory: undefined,
            cpu: undefined
        },
        requests: {
            memory: undefined,
            cpu: undefined
        },
        envProcess: undefined,
        labels: {
            funcName: params.request.getName()
        },
        envVars: {
            ACCESS_KEY_ID: params.accessKeyId,
            ACCESS_KEY_SECRET: await auth_1.default(params.accessKeyId),
            APISERVER_ENDPOINT: endpoint
        },
        annotations: {
            topic: undefined,
            schedule: undefined
        }
    };
    const limits = params.request.getLimits();
    const requests = params.request.getRequests();
    if (params.request.getSchedule()) {
        parameters.annotations = {
            topic: "cron-function",
            schedule: params.request.getSchedule()
        };
    }
    if (limits && limits.getMemory())
        parameters.limits.memory = limits.getMemory();
    if (limits && limits.getCpu())
        parameters.limits.cpu = limits.getCpu();
    if (requests && requests.getMemory())
        parameters.requests.memory = requests.getMemory();
    if (requests && requests.getCpu())
        parameters.requests.cpu = requests.getCpu();
    return parameters;
};
exports.buildFaasDeployParameters = buildFaasDeployParameters;
const rawFuncToFunc = (rawFunc) => {
    const func = new funcs_pb_1.Func();
    func.setName(rawFunc.labels.funcName);
    func.setImage(rawFunc.image);
    func.setInvocationCount(rawFunc.invocationCount);
    func.setReplicas(rawFunc.replicas);
    func.setAvailableReplicas(rawFunc.availableReplicas);
    if (rawFunc.annotations && rawFunc.annotations.schedule) {
        func.setSchedule(rawFunc.annotations.schedule);
    }
    return func;
};
exports.rawFuncToFunc = rawFuncToFunc;
