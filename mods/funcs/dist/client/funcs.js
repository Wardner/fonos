"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeployFuncRequest = exports.CommonPB = exports.FuncsPB = void 0;
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
const storage_1 = __importDefault(require("@fonos/storage"));
const common_1 = require("@fonos/common");
const funcs_grpc_pb_1 = require("../service/protos/funcs_grpc_pb");
const funcs_pb_1 = __importDefault(require("../service/protos/funcs_pb"));
exports.FuncsPB = funcs_pb_1.default;
const common_pb_1 = __importDefault(require("../service/protos/common_pb"));
exports.CommonPB = common_pb_1.default;
const grpc_1 = __importDefault(require("grpc"));
const utils_1 = require("../utils/utils");
Object.defineProperty(exports, "buildDeployFuncRequest", { enumerable: true, get: function () { return utils_1.buildDeployFuncRequest; } });
const stream_wrappers_1 = require("./stream_wrappers");
/**
 * @classdesc Use Fonos Funcs, a capability of FaaS subsystem,
 * to deploy, update, get and delete functions. Fonos Funcs requires of a
 * running Fonos deployment and FaaS.
 *
 * @extends FonosService
 * @example
 *
 * const request = {
 *   name: "function1",
 *   path: "/path/to/function",
 * };
 *
 * funcs.deployFunc(request)
 * .then(stream => {
 *   stream.onMessage(msg => console.log(msg))
 *   stream.onFinish(() => console.log("end"))
 *   stream.onError(e => console.error(e))
 * }).catch(e => console.error(e));   // an error occurred
 */
class Funcs extends common_1.FonosService {
    /**
     * Constructs a new Funcs object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options) {
        super(funcs_grpc_pb_1.FuncsClient, options);
        super.init(grpc_1.default);
        this.storage = new storage_1.default(super.getOptions());
    }
    /**
     * Creates or updates a function in the FaaS subsystem.
     *
     * @param {DeployFuncRequest} request - Request to create or update a function
     * @param {string} request.path - Path to the function.
     * @param {string} request.name - Unique function name
     * @param {string} request.schedule - Unique function name
     * @param {string} request.limit.memory - Optional limit for function's memory utilization
     * @param {string} request.limit.cpu - Optional limit for function's cpu utilization
     * @param {string} request.requests.memory - Optional requested memory allocation for the function
     * @param {string} request.requests.cpu - Optional requested cpu allocation for the function
     * @return {Promise<DeployStream>}
     * @example
     *
     * const Fonos = require("@fonos/sdk");
     * const funcs = new Fonos.Funcs();
     *
     * const request = {
     *   name: "function1",
     *   schedule: "* * * * *",  // Intervals using standard cron syntax
     *   path: "/path/to/function",
     *   limits: {
     *      cpu: 100m,
     *      memory: 40Mi
     *   },
     *   requests: {
     *      cpu: 100m,
     *      memory: 40Mi
     *   }
     * };
     *
     * funcs.deployFunc(request)
     * .then(stream => {
     *   stream.onMessage(msg => console.log(msg))
     *   stream.onFinish(() => console.log("end"))
     *   stream.onError(e => console.error(e))
     * }).catch(e => console.error(e));   // an error occurred
     */
    async deployFunc(request) {
        if (request.path) {
            utils_1.cleanupTmpDirSync(request.name);
            await utils_1.copyFuncAtTmp(request.path, request.name);
            await this.storage.uploadObject({
                filename: `/tmp/${request.name}.tgz`,
                bucket: "funcs"
            });
        }
        utils_1.cleanupTmpDirSync(request.name);
        const req = utils_1.buildDeployFuncRequest(request);
        const stream = super.getService().deployFunc(req, super.getMeta());
        return new stream_wrappers_1.DeployStream(stream);
    }
    /**
     * Gets a system function by name.
     *
     * @param {GetFuncRequest} request - Request to get a function
     * @param {string} request.name - Unique function name
     * @return {Promise<GetFuncResponse>}
     * @example
     *
     * const request = {
     *   name: "function1"
     * };
     *
     * funcs.getFunc(request)
     * .then(result => {
     *   console.log(result)              // successful response with the function as the body65
     * }).catch(e => console.error(e));   // an error occurred
     */
    async getFunc(request) {
        return new Promise((resolve, reject) => {
            const req = new funcs_pb_1.default.GetFuncRequest();
            req.setName(request.name);
            super
                .getService()
                .getFunc(req, super.getMeta(), (e, res) => {
                if (e)
                    return reject(e);
                resolve({
                    name: res.getName(),
                    schedule: res.getSchedule(),
                    image: res.getImage(),
                    invocationCount: res.getInvocationCount(),
                    replicas: res.getReplicas(),
                    availableReplicas: res.getAvailableReplicas()
                });
            });
        });
    }
    /**
     * Removes a function by its name.
     *
     * @param {DeleteFuncRequest} request - Request to delete a function
     * @param {string} request.name - Unique function name
     * @return {Promise<GetFuncResponse>}
     * @note This action will remove all function statistics.
     * @example
     *
     * const request = {
     *   name: "function1"
     * };
     *
     * funcs.deleteFunc(request)
     * .then(result => {
     *   console.log(result)              // returns the name of the function
     * }).catch(e => console.error(e));   // an error occurred
     */
    async deleteFunc(request) {
        return new Promise((resolve, reject) => {
            const req = new funcs_pb_1.default.DeleteFuncRequest();
            req.setName(request.name);
            super.getService().deleteFunc(req, super.getMeta(), (e) => {
                if (e)
                    reject(e);
                resolve({
                    name: request.name
                });
            });
        });
    }
    /**
     * Returns a list of functions owned by the User.
     *
     * @param {ListFuncsRequest} request
     * @param {number} request.pageSize - Number of element per page
     * (defaults to 20)
     * @param {string} request.pageToken - The next_page_token value returned from
     * a previous List request, if any
     * @return {Promise<ListFuncsResponse>} List of Functions
     * @example
     *
     * const request = {
     *    pageSize: 20,
     *    pageToken: 2
     * };
     *
     * funcs.listFuncs(request)
     * .then(() => {
     *   console.log(result)             // returns a ListFuncsResponse object
     * }).catch(e => console.error(e));  // an error occurred
     */
    async listFuncs(request) {
        return new Promise((resolve, reject) => {
            const req = new funcs_pb_1.default.ListFuncsRequest();
            req.setPageSize(request.pageSize);
            req.setPageToken(request.pageToken);
            req.setView(request.view);
            super
                .getService()
                .listFuncs(req, super.getMeta(), (e, paginatedList) => {
                if (e)
                    reject(e);
                resolve({
                    nextPageToken: paginatedList.getNextPageToken(),
                    funcs: paginatedList.getFuncsList().map((f) => {
                        return {
                            name: f.getName(),
                            image: f.getImage(),
                            replicas: f.getReplicas(),
                            invocationCount: f.getInvocationCount(),
                            availableReplicas: f.getAvailableReplicas(),
                            schedule: f.getSchedule()
                        };
                    })
                });
            });
        });
    }
    /**
     * Creates or updates a function in the FaaS subsystem.
     *
     * @param {GetFuncLogsRequest} request - Request to obtain the logs for a function
     * @param {string} request.name - Function name
     * @param {string} request.since - Only return logs after a specific date (RFC3339)
     * @param {string} request.tail - Sets the maximum number of log messages to return, <=0 means unlimited
     * @param {string} request.follow - When true, the request will stream logs until the request timeout
     * @return {Promise<LogsStream>}
     * @example
     *
     * const Fonos = require("@fonos/sdk");
     * const funcs = new Fonos.Funcs();
     *
     * const request = {
     *   name: "function1",
     *   tail: 10,
     *   follow: true,
     *   since: "2021-05-12T07:20:50.52Z"
     * };
     *
     * funcs.getFuncLogs(request)
     * .then(stream => {
     *   stream.onMessage(log => console.log(log))
     *   stream.onFinish(() => console.log("end"))
     *   stream.onError(e => console.error(e))
     * }).catch(e => console.error(e));   // an error occurred
     */
    async getFuncLogs(request) {
        const req = new funcs_pb_1.default.GetFuncLogsRequest();
        req.setName(request.name);
        req.setSince(request.since);
        req.setTail(request.tail);
        req.setFollow(request.follow);
        const stream = super.getService().getFuncLogs(req, super.getMeta());
        return new stream_wrappers_1.LogsStream(stream);
    }
}
exports.default = Funcs;
// WARNING: Workaround to support commonjs clients
module.exports = Funcs;
module.exports.FuncsPB = funcs_pb_1.default;
module.exports.CommonPB = common_pb_1.default;
module.exports.buildDeployFuncRequest = utils_1.buildDeployFuncRequest;
