"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsService = exports.default = void 0;
const get_secret_1 = __importDefault(require("./get_secret"));
const create_secret_1 = __importDefault(require("./create_secret"));
const delete_secret_1 = __importDefault(require("./delete_secret"));
const list_secret_1 = __importDefault(require("./list_secret"));
const secrets_pb_1 = require("./protos/secrets_pb");
const common_pb_1 = require("./protos/common_pb");
const core_1 = require("@fonos/core");
const secrets_grpc_pb_1 = require("./protos/secrets_grpc_pb");
Object.defineProperty(exports, "SecretsService", { enumerable: true, get: function () { return secrets_grpc_pb_1.SecretsService; } });
class SecretServer {
    async listSecretsId(call, callback) {
        try {
            const result = await list_secret_1.default(parseInt(call.request.getPageToken()), call.request.getPageSize(), core_1.getAccessKeyId(call));
            const response = new secrets_pb_1.ListSecretIdResponse();
            response.setSecretsList(result.secrets);
            if (result.pageToken)
                response.setNextPageToken("" + result.pageToken);
            callback(null, response);
        }
        catch (e) {
            callback(e, null);
        }
    }
    async getSecret(call, callback) {
        try {
            const name = call.request.getName();
            const accessKeyId = core_1.getAccessKeyId(call);
            const data = await get_secret_1.default(name, accessKeyId);
            callback(null, data);
        }
        catch (e) {
            callback(e, null);
        }
    }
    async createSecret(call, callback) {
        try {
            const name = call.request.getName();
            const secret = call.request.getSecret();
            const accessKeyId = core_1.getAccessKeyId(call);
            const data = await create_secret_1.default(name, secret, accessKeyId);
            callback(null, data);
        }
        catch (e) {
            callback(e, null);
        }
    }
    async deleteSecret(call, callback) {
        try {
            await delete_secret_1.default(call.request.getName(), core_1.getAccessKeyId(call));
            callback(null, new common_pb_1.Empty());
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = SecretServer;
