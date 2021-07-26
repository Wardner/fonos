"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsService = exports.default = void 0;
const domains_pb_1 = require("./protos/domains_pb");
const common_pb_1 = require("./protos/common_pb");
const domains_grpc_pb_1 = require("./protos/domains_grpc_pb");
Object.defineProperty(exports, "DomainsService", { enumerable: true, get: function () { return domains_grpc_pb_1.DomainsService; } });
const core_1 = require("@fonos/core");
const decoder_1 = __importDefault(require("./decoder"));
const decoder_2 = __importDefault(require("./decoder"));
class DomainsServer extends core_1.ResourceServer {
    async listDomains(call, callback) {
        const result = await super.listResources(core_1.Kind.DOMAIN, call);
        const response = new domains_pb_1.ListDomainsResponse();
        if (result.resources) {
            const domains = result.resources.map((resource) => decoder_2.default(resource));
            response.setNextPageToken(result.nextPageToken + "");
            response.setDomainsList(domains);
        }
        callback(null, response);
    }
    async createDomain(call, callback) {
        const domain = call.request.getDomain();
        try {
            const resource = new core_1.ResourceBuilder(core_1.Kind.DOMAIN, domain.getName(), domain.getRef())
                .withDomainUri(domain.getDomainUri())
                .withEgressPolicy(domain.getEgressRule(), domain.getEgressNumberRef())
                .withACL(domain.getAccessAllowList(), domain.getAccessDenyList())
                .withMetadata({ accessKeyId: core_1.getAccessKeyId(call) })
                .build();
            const response = await core_1.createResource(resource);
            callback(null, decoder_1.default(response));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async updateDomain(call, callback) {
        const domain = call.request.getDomain();
        try {
            const resource = new core_1.ResourceBuilder(core_1.Kind.DOMAIN, domain.getName(), domain.getRef())
                .withMetadata({
                createdOn: domain.getCreateTime(),
                modifiedOn: domain.getUpdateTime()
            })
                .withDomainUri(domain.getDomainUri())
                .withEgressPolicy(domain.getEgressRule(), domain.getEgressNumberRef())
                .withACL(domain.getAccessAllowList(), domain.getAccessDenyList())
                .build();
            const result = await core_1.updateResource({
                resource,
                accessKeyId: core_1.getAccessKeyId(call)
            });
            callback(null, decoder_2.default(result));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async getDomain(call, callback) {
        try {
            const result = await super.getResource(core_1.Kind.DOMAIN, call);
            callback(null, decoder_2.default(result));
        }
        catch (e) {
            callback(e, null);
        }
    }
    async deleteDomain(call, callback) {
        try {
            await super.deleteResource(core_1.Kind.DOMAIN, call);
            callback(null, new common_pb_1.Empty());
        }
        catch (e) {
            callback(e, null);
        }
    }
}
exports.default = DomainsServer;
