"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = exports.default = void 0;
const agents_pb_1 = require("./protos/agents_pb");
const common_pb_1 = require("./protos/common_pb");
const agents_grpc_pb_1 = require("./protos/agents_grpc_pb");
Object.defineProperty(exports, "AgentsService", { enumerable: true, get: function () { return agents_grpc_pb_1.AgentsService; } });
const core_1 = require("@fonos/core");
const core_2 = require("@fonos/core");
const decoder_1 = __importDefault(require("./decoder"));
class AgentsServer extends core_2.ResourceServer {
    async listAgents(call, callback) {
        const result = await super.listResources(core_1.Kind.AGENT, call);
        const response = new agents_pb_1.ListAgentsResponse();
        if (result && result.resources) {
            const domains = result.resources.map((resource) => decoder_1.default(resource));
            response.setNextPageToken(result.nextPageToken + "");
            response.setAgentsList(domains);
        }
        callback(null, response);
    }
    async createAgent(call, callback) {
        const agent = call.request.getAgent();
        try {
            const resource = new core_1.ResourceBuilder(core_1.Kind.AGENT, agent.getName())
                .withCredentials(agent.getUsername(), agent.getSecret())
                .withDomains(agent.getDomainsList())
                .withMetadata({ accessKeyId: core_2.getAccessKeyId(call) })
                .build();
            //.withPrivacy(provider.getPrivacy()) // TODO
            const response = await core_2.createResource(resource);
            callback(null, decoder_1.default(response));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async updateAgent(call, callback) {
        const agent = call.request.getAgent();
        try {
            const resource = new core_1.ResourceBuilder(core_1.Kind.AGENT, agent.getName(), agent.getRef())
                .withCredentials(agent.getUsername(), agent.getSecret())
                .withDomains(agent.getDomainsList())
                .withMetadata({
                createdOn: agent.getCreateTime(),
                modifiedOn: agent.getUpdateTime()
            })
                .build();
            const result = await core_2.updateResource({
                resource,
                accessKeyId: core_2.getAccessKeyId(call)
            });
            callback(null, decoder_1.default(result));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async getAgent(call, callback) {
        try {
            const result = await super.getResource(core_1.Kind.AGENT, call);
            callback(null, decoder_1.default(result));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async deleteAgent(call, callback) {
        try {
            await super.deleteResource(core_1.Kind.AGENT, call);
            callback(null, new common_pb_1.Empty());
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = AgentsServer;
