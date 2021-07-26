"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumbersService = exports.default = void 0;
const create_number_1 = __importDefault(require("./create_number"));
const update_number_1 = __importDefault(require("./update_number"));
const core_1 = require("@fonos/core");
const numbers_pb_1 = require("./protos/numbers_pb");
const common_pb_1 = require("./protos/common_pb");
const numbers_grpc_pb_1 = require("./protos/numbers_grpc_pb");
Object.defineProperty(exports, "NumbersService", { enumerable: true, get: function () { return numbers_grpc_pb_1.NumbersService; } });
const core_2 = require("@fonos/core");
const decoder_1 = __importDefault(require("./decoder"));
const errors_1 = require("@fonos/errors");
class NumbersServer extends core_2.ResourceServer {
    async listNumbers(call, callback) {
        const result = await super.listResources(core_2.Kind.NUMBER, call);
        const response = new numbers_pb_1.ListNumbersResponse();
        if (result && result.resources) {
            const domains = result.resources.map((resource) => decoder_1.default(resource));
            response.setNextPageToken(result.nextPageToken + "");
            response.setNumbersList(domains);
        }
        callback(null, response);
    }
    async createNumber(call, callback) {
        try {
            callback(null, await create_number_1.default(call.request.getNumber(), call));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async updateNumber(call, callback) {
        update_number_1.default(call, callback);
    }
    async getIngressInfo(call, callback) {
        try {
            await core_1.routr.connect();
            const result = await core_1.routr.getNumber(call.request.getE164Number());
            if (!result) {
                throw new errors_1.FonosError("Number not found", errors_1.ErrorCodes.NOT_FOUND);
            }
            const number = decoder_1.default(result);
            callback(null, number.getIngressInfo());
        }
        catch (e) {
            callback(e, null);
        }
    }
    async getNumber(call, callback) {
        try {
            const result = await super.getResource(core_2.Kind.NUMBER, call);
            callback(null, decoder_1.default(result));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async deleteNumber(call, callback) {
        try {
            await super.deleteResource(core_2.Kind.NUMBER, call);
            callback(null, new common_pb_1.Empty());
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = NumbersServer;
