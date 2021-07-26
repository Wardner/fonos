"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStream = void 0;
const common_pb_1 = require("./protos/common_pb");
const funcs_pb_1 = require("./protos/funcs_pb");
const openfaas_client_1 = require("openfaas-client");
const logger_1 = __importDefault(require("@fonos/logger"));
const errors_1 = require("@fonos/errors");
const core_1 = require("@fonos/core");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
const registry_1 = __importDefault(require("./registry"));
const btoa_1 = __importDefault(require("btoa"));
const request_1 = __importDefault(require("request"));
const ndjson_1 = __importDefault(require("ndjson"));
const util_1 = require("util");
const sleep = util_1.promisify(setTimeout);
// Initializing access info for FaaS
const faas = new openfaas_client_1.DefaultApi();
const auth = new openfaas_client_1.HttpBasicAuth();
auth.username = process.env.FUNCS_USERNAME;
auth.password = process.env.FUNCS_SECRET;
faas.setDefaultAuthentication(auth);
faas.basePath = process.env.FUNCS_URL;
class ServerStream {
    constructor(call) {
        this.call = call;
    }
    write(message) {
        const msg = new funcs_pb_1.DeployStream();
        msg.setText(message);
        this.call.write(msg);
    }
}
exports.ServerStream = ServerStream;
const publish = async (call, serverStream) => {
    serverStream.write("finished running predeploy script");
    const accessKeyId = core_1.getAccessKeyId(call);
    const parameters = await utils_1.buildFaasDeployParameters({
        request: call.request,
        accessKeyId: accessKeyId
    });
    await registry_1.default({
        registry: process.env.DOCKER_REGISTRY,
        image: parameters.image,
        pathToFunc: utils_1.getBuildDir(accessKeyId, call.request.getName()),
        username: process.env.DOCKER_REGISTRY_USERNAME,
        secret: process.env.DOCKER_REGISTRY_SECRET
    }, serverStream);
    logger_1.default.verbose("@fonos/funcs publish [publishing to funcs subsystem]");
    const attempts = [1, 2, 3];
    let index;
    for (index in attempts) {
        // Sometime the image is not inmediatly available so we try a few times
        logger_1.default.verbose(`@fonos/funcs publish [publishing to functions subsystem (try #${attempts[index]})`);
        serverStream.write("wating for image to be ready");
        serverStream.write(`publishing to functions subsystem (it might take awhile #${attempts[index]})`);
        await sleep(20000);
        try {
            // If the function already exist this will fail
            logger_1.default.verbose(`@fonos/funcs publish [first trying post]`);
            await faas.systemFunctionsPost(parameters);
            break;
        }
        catch (e) {
            logger_1.default.verbose(`@fonos/funcs publish [now trying put]`);
            try {
                await faas.systemFunctionsPut(parameters);
                break;
            }
            catch (e) { }
        }
    }
    return parameters;
};
class FuncsServer {
    // See client-side for comments
    async listFuncs(call, callback) {
        try {
            if (!call.request.getPageToken())
                callback(null, new funcs_pb_1.ListFuncsResponse());
            const accessKeyId = core_1.getAccessKeyId(call);
            const list = (await faas.systemFunctionsGet()).response.body;
            const rawFuncs = list.filter((f) => f.envVars.ACCESS_KEY_ID === accessKeyId);
            const funcs = rawFuncs.map((f) => utils_1.rawFuncToFunc(f));
            const response = new funcs_pb_1.ListFuncsResponse();
            response.setFuncsList(funcs);
            // No pagination need because the list of function is likely to be short
            // response.setNextPageToken()
            callback(null, response);
        }
        catch (e) {
            logger_1.default.error(`@fonos/funcs list [${e}]`);
        }
    }
    // See client-side for comments
    async getFunc(call, callback) {
        try {
            const list = (await faas.systemFunctionsGet()).response.body;
            const accessKeyId = core_1.getAccessKeyId(call);
            const rawFunction = list.filter((f) => f.name === utils_1.getFuncName(accessKeyId, call.request.getName()))[0];
            if (!rawFunction)
                throw new errors_1.FonosError(`function name "${call.request.getName()}" doesn't exist`, errors_1.ErrorCodes.NOT_FOUND);
            callback(null, utils_1.rawFuncToFunc(rawFunction));
        }
        catch (e) {
            logger_1.default.error(`@fonos/funcs get [${e}]`);
            callback(e, null);
        }
    }
    // See client-side for comments
    // TODO: Resign with JWT token
    async deployFunc(call) {
        try {
            utils_1.assertValidFuncName(call.request.getName());
            utils_1.assertValidSchedule(call.request.getSchedule());
            const serverStream = new ServerStream(call);
            serverStream.write("starting deployment");
            await publish(call, serverStream);
            serverStream.write("deployment complete");
            serverStream.write("your function will be available shortly");
            call.end();
        }
        catch (e) {
            logger_1.default.error(`@fonos/funcs deploy [${e}]`);
            if (!e.response) {
                call.emit("error", new errors_1.FonosError(e, errors_1.ErrorCodes.UNKNOWN));
                return;
            }
            if (e.response.statusCode === 400) {
                call.emit("error", new errors_1.FonosError(e.response.body, errors_1.ErrorCodes.INVALID_ARGUMENT));
            }
            else if (e.response.statusCode === 401) {
                call.emit("error", new errors_1.FonosSubsysUnavailable("Functions subsystem unavailable"));
            }
            else if (e.response.statusCode === 404) {
                call.emit("error", new errors_1.FonosError(e.response.body, errors_1.ErrorCodes.NOT_FOUND));
            }
        }
    }
    // See client-side for comments
    async deleteFunc(call, callback) {
        const accessKeyId = core_1.getAccessKeyId(call);
        const functionName = utils_1.getFuncName(accessKeyId, call.request.getName());
        try {
            await faas.systemFunctionsDelete({ functionName });
            callback(null, new common_pb_1.Empty());
        }
        catch (e) {
            logger_1.default.error(`@fonos/funcs delete [${e}]`);
            if (e.response.statusCode === 404) {
                callback(new errors_1.FonosError(`Function name "${call.request.getName()}" doesn't exist`, errors_1.ErrorCodes.NOT_FOUND), null);
            }
            callback(e, null);
        }
    }
    // See client-side for comments
    // TODO: Resign with JWT token
    async getFuncLogs(call) {
        try {
            const accessKeyId = core_1.getAccessKeyId(call);
            const functionName = utils_1.getFuncName(accessKeyId, call.request.getName());
            const stream = request_1.default
                .get(`${faas.basePath}/system/logs?name=${functionName}&since=${call.request.getSince()}&tail=${call.request.getTail()}&follow=${call.request.getFollow()}`, {
                auth: {
                    user: process.env.FUNCS_USERNAME,
                    pass: process.env.FUNCS_SECRET,
                    sendImmediately: false
                }
            })
                .on("response", function (res) {
                if (res.statusCode === 200) {
                    stream.pipe(ndjson_1.default.parse()).on("data", (data) => {
                        const entry = new funcs_pb_1.FuncLog();
                        entry.setName(data.name);
                        entry.setTimestamp(data.timestamp);
                        entry.setInstance(data.instance);
                        entry.setText(data.text);
                        call.write(entry);
                    });
                }
            })
                .on("error", (e) => {
                logger_1.default.error(`@fonos/funcs system logs [error while receiving data: ${e}]`);
                call.end();
            })
                .on("end", () => {
                logger_1.default.verbose("@fonos/funcs system logs [done receiving data]");
                call.end();
            });
        }
        catch (e) {
            logger_1.default.error(`@fonos/funcs deploy [${e}]`);
            if (e.response.statusCode === 400) {
                call.emit("error", new errors_1.FonosError(e.response.body, errors_1.ErrorCodes.INVALID_ARGUMENT));
            }
            else if (e.response.statusCode === 401) {
                call.emit("error", new errors_1.FonosSubsysUnavailable("Functions subsystem unavailable"));
            }
            else if (e.response.statusCode === 404) {
                call.emit("error", new errors_1.FonosError(e.response.body, errors_1.ErrorCodes.NOT_FOUND));
            }
            call.emit("error", new errors_1.FonosError(e, errors_1.ErrorCodes.NOT_FOUND));
        }
    }
    /**
     * @deprecated
     *
     * This function creates a single use, scoped token, useful for pushing images
     * to a private Docker registry.
     */
    async createRegistryToken(call, callback) {
        try {
            if (!call.request.getFuncName())
                throw new errors_1.FonosError("Missing function name", errors_1.ErrorCodes.INVALID_ARGUMENT);
            const endpoint = process.env.DOCKER_REGISTRY_AUTH_ENDPOINT;
            const service = process.env.DOCKER_REGISTRY_SERVICE;
            const auth = btoa_1.default(`${process.env.DOCKER_REGISTRY_USERNAME}:${process.env.DOCKER_REGISTRY_SECRET}`);
            const accessKeyId = core_1.getAccessKeyId(call);
            const image = utils_1.getImageName(accessKeyId, call.request.getFuncName());
            const baseURL = `${endpoint}?service=${service}&scope=repository:${image}:push`;
            const result = await axios_1.default
                .create({
                headers: { Authorization: `Basic ${auth}` }
            })
                .get(baseURL);
            const token = result.data.token;
            const res = new funcs_pb_1.CreateRegistryTokenResponse();
            res.setToken(token);
            res.setImage(image);
            callback(null, res);
        }
        catch (e) {
            callback(new errors_1.FonosError(e), null);
        }
    }
}
exports.default = FuncsServer;
