import { FonosService, ServiceOptions } from "@fonos/common";
import FuncsPB from "../service/protos/funcs_pb";
import CommonPB from "../service/protos/common_pb";
import { DeleteFuncRequest, DeleteFuncResponse, DeployFuncRequest, GetFuncLogsRequest, GetFuncRequest, GetFuncResponse, ListFuncsRequest, ListFuncsResponse } from "./types";
import { buildDeployFuncRequest } from "../utils/utils";
import { DeployStream, LogsStream } from "./stream_wrappers";
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
export default class Funcs extends FonosService {
    storage: any;
    /**
     * Constructs a new Funcs object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
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
    deployFunc(request: DeployFuncRequest): Promise<DeployStream>;
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
    getFunc(request: GetFuncRequest): Promise<GetFuncResponse>;
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
    deleteFunc(request: DeleteFuncRequest): Promise<DeleteFuncResponse>;
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
    listFuncs(request: ListFuncsRequest): Promise<ListFuncsResponse>;
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
    getFuncLogs(request: GetFuncLogsRequest): Promise<LogsStream>;
}
export { FuncsPB, CommonPB, buildDeployFuncRequest };
