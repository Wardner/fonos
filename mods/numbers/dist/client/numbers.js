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
exports.CommonPB = exports.NumbersPB = void 0;
const common_1 = require("@fonos/common");
const numbers_grpc_pb_1 = require("../service/protos/numbers_grpc_pb");
const numbers_pb_1 = __importStar(require("../service/protos/numbers_pb"));
exports.NumbersPB = numbers_pb_1.default;
const common_pb_1 = __importDefault(require("../service/protos/common_pb"));
exports.CommonPB = common_pb_1.default;
const grpc_promise_1 = require("grpc-promise");
const grpc_1 = __importDefault(require("grpc"));
/**
 * @classdesc Use Fonos Numbers, a capability of Fonos SIP Proxy subsystem,
 * to create, update, get and delete numbers. Fonos Numbers requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk");
 * const numbers = new Fonos.Numbers();
 *
 * const request = {
 *   providerRef: "516f1577bcf86cd797439012",
 *   e164Number: "+17853177343",
 *   ingressInfo: {
 *      webhook: "https://webhooks.acme.com/hooks"
 *   }
 * };
 *
 * numbers.createNumber(request)
 * .then(result => {
 *   console.log(result)             // successful response
 * }).catch(e => console.error(e));   // an error occurred
 */
class Numbers extends common_1.FonosService {
    /**
     * Constructs a new Numbers object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options = {}) {
        super(numbers_grpc_pb_1.NumbersClient, options);
        super.init(grpc_1.default);
        grpc_promise_1.promisifyAll(super.getService(), { metadata: super.getMeta() });
    }
    /**
     * Creates a new Number on the SIP Proxy subsystem.
     *
     * @param {CreateNumberRequest} request -  Request for the provision of a new Number
     * @param {string} request.providerRef - Idenfier to the Provider this Number belongs
     * with
     * @param {string} request.e164Number - A valid number @ Provider
     * @param {string} request.aorLink - An AOR where ingress calls will be
     * directed to
     * @param {string} request.ingressInfo - Webhook to connect call to
     * @note You can only provider an aorLink or an ingressInfo but no both
     * @return {Promise<CreateNumberResponse>}
     * @example
     *
     * const request = {
     *   providerRef: "516f1577bcf86cd797439012",
     *   e164Number: "+17853177343",
     *   aorLink: "sip:1001@sip.local"
     * };
     *
     * numbers.createNumber(request)
     * .then(result => {
     *   console.log(result)            // returns the CreateNumberResponse interface
     * }).catch(e => console.error(e));  // an error occurred
     */
    async createNumber(request) {
        const number = new numbers_pb_1.default.Number();
        const ingressInfo = new numbers_pb_1.default.IngressInfo();
        ingressInfo.setWebhook(request.ingressInfo ? request.ingressInfo.webhook : null);
        number.setProviderRef(request.providerRef);
        number.setE164Number(request.e164Number);
        number.setIngressInfo(ingressInfo);
        number.setAorLink(request.aorLink);
        const req = new numbers_pb_1.default.CreateNumberRequest();
        req.setNumber(number);
        const res = await super.getService().createNumber().sendMessage(req);
        return {
            ref: res.getRef()
        };
    }
    /**
     * Retrives a Number by its reference.
     *
     * @param {string} ref - Reference to Number
     * @return {Promise<GetNumberResponse>} The GetNumberResponse
     * @throws if ref is null or Number does not exist
     * @example
     *
     * numbers.getNumber(ref)
     * .then(result => {
     *   console.log(result)             // returns the GetNumberResponse object
     * }).catch(e => console.error(e));   // an error occurred
     */
    async getNumber(ref) {
        const req = new numbers_pb_1.default.GetNumberRequest();
        req.setRef(ref);
        const res = await this.getService().getNumber().sendMessage(req);
        return {
            aorLink: res.getAorLink(),
            e164Number: res.getE164Number(),
            ingressInfo: {
                webhook: res.getIngressInfo() ? res.getIngressInfo().getWebhook : null
            },
            providerRef: res.getProviderRef(),
            ref: res.getRef(),
            createTime: res.getCreateTime(),
            updateTime: res.getUpdateTime()
        };
    }
    /**
     * Update a Number at the SIP Proxy subsystem.
     *
     * @param {UpdateNumberRequest} request - Request for the update of an existing Number
     * @param {string} request.aorLink - An AOR where ingress calls will be
     * directed to
     * @param {string} request.ingressInfo - A webhook to direct the call for flow control
     * @note You can only provider an aorLink or an ingressApp but no both
     * @return {Promise<UpdateNumberResponse>}
     * @example
     *
     * const request = {
     *   ref: "516f1577bcf86cd797439012",
     *   aorLink: "sip:1001@sip.local"
     * };
     *
     * numbers.updateNumber(request)
     * .then(result => {
     *   console.log(result)            // returns the Number from the DB
     * }).catch(e => console.error(e));  // an error occurred
     */
    async updateNumber(request) {
        const getRequest = new numbers_pb_1.default.GetNumberRequest();
        getRequest.setRef(request.ref);
        const numberFromDB = await this.getService()
            .getNumber()
            .sendMessage(getRequest);
        if (request.aorLink && request.ingressInfo) {
            throw new Error("'ingressApp' and 'aorLink' are not compatible parameters");
        }
        else if (!request.aorLink && !request.ingressInfo) {
            throw new Error("You must provider either an 'ingressApp' or and 'aorLink'");
        }
        if (request.aorLink) {
            numberFromDB.setAorLink(request.aorLink);
            numberFromDB.setIngressInfo(undefined);
        }
        else {
            numberFromDB.setAorLink(undefined);
            const ingressInfo = new numbers_pb_1.IngressInfo();
            ingressInfo.setWebhook(request.ingressInfo ? request.ingressInfo.webhook : null);
            numberFromDB.setIngressInfo(ingressInfo);
        }
        const req = new numbers_pb_1.default.UpdateNumberRequest();
        req.setNumber(numberFromDB);
        const result = await super.getService().updateNumber().sendMessage(req);
        const response = {
            ref: result.getRef()
        };
        return response;
    }
    /**
     * List the Numbers registered in Fonos SIP Proxy subsystem.
     *
     * @param {ListNumbersRequest} request
     * @param {number} request.pageSize - Number of element per page
     * (defaults to 20)
     * @param {string} request.pageToken - The next_page_token value returned from
     * a previous List request, if any
     * @return {Promise<ListNumbersResponse>} List of Numbers
     * @example
     *
     * const request = {
     *    pageSize: 20,
     *    pageToken: 2
     * };
     *
     * numbers.listNumbers(request)
     * .then(() => {
     *   console.log(result)            // returns a ListNumbersResponse object
     * }).catch(e => console.error(e));  // an error occurred
     */
    async listNumbers(request) {
        const r = new numbers_pb_1.default.ListNumbersRequest();
        r.setPageSize(request.pageSize);
        r.setPageToken(request.pageToken);
        r.setView(request.view);
        const paginatedList = await this.getService().listNumbers().sendMessage(r);
        return {
            nextPageToken: paginatedList.getNextPageToken(),
            numbers: paginatedList.getNumbersList().map((n) => {
                return {
                    ref: n.getRef(),
                    providerRef: n.getProviderRef(),
                    e164Number: n.getE164Number(),
                    ingressInfo: {
                        webhook: n.getIngressInfo() ? n.getIngressInfo().getWebhook() : null
                    },
                    aorLink: n.getAorLink(),
                    createTime: n.getCreateTime(),
                    updateTime: n.getUpdateTime()
                };
            })
        };
    }
    /**
     * Deletes a Number from SIP Proxy subsystem.
     *
     * @param {string} ref - Reference to the Number
     * @example
     *
     * const ref = "cb8V0CNTfH";
     *
     * numbers.deleteNumber(ref)
     * .then(() => {
     *   console.log("done")            // returns an empty object
     * }).catch(e => console.error(e))  // an error occurred
     */
    async deleteNumber(ref) {
        const req = new numbers_pb_1.default.DeleteNumberRequest();
        req.setRef(ref);
        await super.getService().deleteNumber().sendMessage(req);
        return {
            ref
        };
    }
    /**
     * Get the Ingress App for a given e164 number.
     *
     * @param {GetIngressAppRequest} request
     * @param {string} request.e164Number - A number in E164 format for
     * incomming calls
     * @return {Promise<GetIngressAppResponse>}
     * @throws if the Number is not register in Fonos
     * @example
     *
     * const request = {
     *    e164Number: "+17853178071"
     * };
     *
     * numbers.getIngressApp(request)
     * .then(result => {
     *   console.log(result)            // returns the Application
     * }).catch(e => console.error(e));  // an error occurred
     */
    async getIngressInfo(request) {
        const req = new numbers_pb_1.default.GetIngressInfoRequest();
        req.setE164Number(request.e164Number);
        const result = await super.getService().getIngressInfo().sendMessage(req);
        return {
            webhook: result.getWebhook(),
            accessKeyId: result.getAccessKeyId()
        };
    }
}
exports.default = Numbers;
// WARNING: Workaround for support to commonjs clients
module.exports = Numbers;
module.exports.NumbersPB = numbers_pb_1.default;
module.exports.CommonPB = common_pb_1.default;
