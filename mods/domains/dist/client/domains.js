"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonPB = exports.DomainsPB = void 0;
const common_1 = require("@fonos/common");
const domains_grpc_pb_1 = require("../service/protos/domains_grpc_pb");
const domains_pb_1 = __importDefault(require("../service/protos/domains_pb"));
exports.DomainsPB = domains_pb_1.default;
const common_pb_1 = __importDefault(require("../service/protos/common_pb"));
exports.CommonPB = common_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
/**
 * @classdesc Use Fonos Domains, a capability of Fonos SIP Proxy Subsystem,
 * to create, update, get and delete Domains. The API requires of a running
 * Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk");
 * const domains = new Fonos.Domains();
 *
 * domains.createDomain({name: "Local Domain", domainUri: "sip.local"...})
 * .then(result => {
 *   console.log(result)             // successful response
 * }).catch(e => console.error(e));   // an error occurred
 */
class Domains extends common_1.FonosService {
    /**
     * Constructs a new Domains object.
     *
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options) {
        super(domains_grpc_pb_1.DomainsClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
    /**
     * Creates a new Domain on the SIP Proxy subsystem.
     *
     * @param {CreateDomainRequest} request - Request for the provision of
     * a new Domain
     * @param {string} request.name - Friendly name for the SIP domain
     * @param {string} request.domainUri - Domain URI. FQDN is recommended
     * @param {string} request.egressNumberRef - A valid reference to a Number
     * in Fonos
     * @param {string} request.egressRule - Regular expression indicating when a
     * call will be routed via request.egressNumberRef
     * @param {string} request.accessDeny - Optional list of IPs or networks that
     * cannot communicate with this Domain
     * @param {string} request.accessAllow - Optional list of IPs or networks
     * allow if request.accessDeny is defined
     * @return {Promise<CreateDomainResponse>}
     * @example
     *
     * const request = {
     *    name: "Local Domain",
     *    domainUri: "sip.local",
     *    egressRule: ".*",
     *    egressNumberRef: "cb8V0CNTfH",
     *    accessDeny: ["0.0.0.0/1"]     // Deny all
     *    accessAllow: ["192.168.1.0/255.255.255.0", "192.168.0.1/31"]
     * };
     *
     * domains.createDomain(request)
     * .then(result => {
     *   console.log(result) // returns the CreateDomainResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    async createDomain(request) {
        const domain = new domains_pb_1.default.Domain();
        domain.setName(request.name);
        domain.setDomainUri(request.domainUri);
        domain.setEgressRule(request.egressRule);
        domain.setEgressNumberRef(request.egressNumberRef);
        domain.setAccessDenyList(request.accessDeny);
        domain.setAccessAllowList(request.accessAllow);
        const outRequest = new domains_pb_1.default.CreateDomainRequest();
        outRequest.setDomain(domain);
        const res = await super.getService().createDomain().sendMessage(outRequest);
        return {
            ref: res.getRef(),
            name: res.getName(),
            domainUri: res.getDomainUri(),
            egressRule: res.getEgressRule(),
            egressNumberRef: res.getEgressNumberRef(),
            accessDeny: res.getAccessDenyList(),
            accessAllow: res.getAccessAllowList(),
            createTime: res.getCreateTime(),
            updateTime: res.getUpdateTime()
        };
    }
    /**
     * Retrives a Domain by its reference.
     *
     * @param {string} ref - Reference to Domain
     * @return {Promise<GetDomainResponse>} The domain
     * @throws if ref is null or Domain does not exist
     * @example
     *
     * const ref = "Nx05y-ldZa";
     *
     * domains.getDomain(ref)
     * .then(result => {
     *   console.log(result) // returns the CreateGetResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    async getDomain(ref) {
        const request = new domains_pb_1.default.GetDomainRequest();
        request.setRef(ref);
        const res = await super.getService().getDomain().sendMessage(request);
        return {
            ref: res.getRef(),
            name: res.getName(),
            domainUri: res.getDomainUri(),
            egressRule: res.getEgressRule(),
            egressNumberRef: res.getEgressNumberRef(),
            accessDeny: res.getAccessDenyList(),
            accessAllow: res.getAccessAllowList(),
            createTime: res.getCreateTime(),
            updateTime: res.getUpdateTime()
        };
    }
    /**
     * Update a Domain at the SIP Proxy subsystem.
     *
     * @param {UpdateDomainRequest} request - Request for the update of an
     * existing Domain
     * @param {string} request.ref - To update a Domain you must provide
     * its reference
     * @param {string} request.name - Friendly name for the SIP domain
     * @param {string} request.egressNumberRef - A valid reference to a
     * Number in Fonos
     * @param {string} request.egressRule - Regular expression indicating when a
     * call will be routed via request.egressNumberRef
     * @param {string} request.accessDeny - Optional list of IPs or networks that
     * cannot communicate with this Domain
     * @param {string} request.accessAllow - Optiona list of IPs or networks
     * allow if request.accessDeny is defined
     * @return {Promise<UpdateDomainResponse>}
     * @example
     *
     * const request = {
     *    ref: "Nx05y-ldZa",
     *    name: "Office Domain",
     *    accessAllow: ["192.168.1.0/255.255.255.0", "192.168.0.1/31"]
     * };
     *
     * domains.updateDomain(request)
     * .then(result => {
     *   console.log(result) // returns the UpdateDomainResponse interface
     * }).catch(e => console.error(e)); // an error occurred
     */
    async updateDomain(request) {
        const getDomainRequest = new domains_pb_1.default.GetDomainRequest();
        getDomainRequest.setRef(request.ref);
        const domain = await super
            .getService()
            .getDomain()
            .sendMessage(getDomainRequest);
        if (request.name)
            domain.setName(request.name);
        if (request.egressRule)
            domain.setEgressRule(request.egressRule);
        if (request.egressNumberRef) {
            domain.setEgressNumberRef(request.egressNumberRef);
        }
        if (request.accessDeny)
            domain.setAccessDenyList(request.accessDeny);
        if (request.accessAllow)
            domain.setAccessAllowList(request.accessAllow);
        const req = new domains_pb_1.default.UpdateDomainRequest();
        req.setDomain(domain);
        const res = await super.getService().updateDomain().sendMessage(req);
        return {
            ref: res.getRef()
        };
    }
    /**
     * List the Domains registered in Fonos SIP Proxy subsystem.
     *
     * @param {ListDomainsRequest} request - Optional parameter with size and
     * token for the request
     * @param {number} request.pageSize - Number of element per page
     * (defaults to 20)
     * @param {string} request.pageToken - The next_page_token value returned from
     * a previous List request if any
     * @return {Promise<ListDomainsResponse>} Paginated list of Domains
     * @example
     *
     * const request = {
     *    pageSize: 20,
     *    pageToken: 2
     * };
     *
     * domains.listDomains(request)
     * .then(() => {
     *   console.log(result)            // returns a ListDomainsResponse interface
     * }).catch(e => console.error(e));  // an error occurred
     */
    async listDomains(request) {
        const r = new domains_pb_1.default.ListDomainsRequest();
        r.setPageSize(request.pageSize);
        r.setPageToken(request.pageToken);
        r.setView(request.view);
        const paginatedList = await super.getService().listDomains().sendMessage(r);
        return {
            nextPageToken: paginatedList.getNextPageToken(),
            domains: paginatedList.getDomainsList().map((d) => {
                return {
                    ref: d.getRef(),
                    name: d.getName(),
                    domainUri: d.getDomainUri(),
                    egressRule: d.getEgressRule(),
                    egressNumberRef: d.getEgressNumberRef(),
                    accessDeny: d.getAccessDenyList(),
                    accessAllow: d.getAccessAllowList(),
                    createTime: d.getCreateTime(),
                    updateTime: d.getUpdateTime()
                };
            })
        };
    }
    /**
     * Deletes a Domain from SIP Proxy subsystem. Notice, that in order to delete
     * a Domain, you must first delete all it's Agents.
     *
     * @param {string} ref - Reference to the Domain you wish to delete
     * @example
     *
     * const ref = "Nx05y-ldZa";
     *
     * domains.deleteDomain(ref)
     * .then(() => {
     *   console.log("done")            // returns a reference of the domain
     * }).catch(e => console.error(e));  // an error occurred
     */
    async deleteDomain(ref) {
        const req = new domains_pb_1.default.DeleteDomainRequest();
        req.setRef(ref);
        await super.getService().deleteDomain().sendMessage(req);
        return { ref };
    }
}
exports.default = Domains;
// WARNING: Workaround for support to commonjs clients
module.exports = Domains;
module.exports.DomainsPB = domains_pb_1.default;
module.exports.CommonPB = common_pb_1.default;
