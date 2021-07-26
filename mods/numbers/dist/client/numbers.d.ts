import { ListNumbersRequest, UpdateNumberResponse, CreateNumberRequest, UpdateNumberRequest, CreateNumberResponse, GetNumberResponse, DeleteNumberResponse, ListNumbersResponse, GetIngressInfoRequest, GetIngressInfoResponse } from "./types";
import { FonosService, ServiceOptions } from "@fonos/common";
import NumbersPB from "../service/protos/numbers_pb";
import CommonPB from "../service/protos/common_pb";
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
export default class Numbers extends FonosService {
    /**
     * Constructs a new Numbers object.
     * @param {ServiceOptions} options - Options to indicate the objects endpoint
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
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
    createNumber(request: CreateNumberRequest): Promise<CreateNumberResponse>;
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
    getNumber(ref: string): Promise<GetNumberResponse>;
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
    updateNumber(request: UpdateNumberRequest): Promise<UpdateNumberResponse>;
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
    listNumbers(request: ListNumbersRequest): Promise<ListNumbersResponse>;
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
    deleteNumber(ref: string): Promise<DeleteNumberResponse>;
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
    getIngressInfo(request: GetIngressInfoRequest): Promise<GetIngressInfoResponse>;
}
export { NumbersPB, CommonPB };
