import { FonosService, ServiceOptions } from "@fonos/common";
import CallManagerPB from "../service/protos/callmanager_pb";
import { CallRequest, CallResponse } from "./types";
/**
 * @classdesc Use Fonos CallManager, a capability of Fonos Systems Manager,
 * to initiate and monitor automated calls. Fonos CallManager requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk")
 * const callManager = new Fonos.CallManager()
 *
 * callManager.call({
 *   from: "9102104343",
 *   to: "17853178070"
 *   app: "default"
 * })
 * .then(console.log)        // successful response
 * .catch(console.error)   // an error occurred
 */
export default class CallManager extends FonosService {
    /**
     * Constructs a new CallManager Object.
     *
     * @see module:core:FonosService
     */
    constructor(options?: ServiceOptions);
    /**
     * Call method.
     *
     * @param {CallRequest} request - Call request options
     * @param {string} request.from - Number you are calling from. You must have this Number configured in your account
     * @param {string} request.to - The callee
     * @param {string} request.webhook - Url of the application that will handle the call.
     * If none is provided it will use the webook setup in the Number
     * @param {string} request.ignoreE164Validation - If enabled it will accept any input in the from and to
     * @return {Promise<CallResponse>} - call results
     * @throws if the from number doesn't exist
     * @throws if could not connect to the underline services
     * @example
     *
     * callManager.call({
     *   from: "+19102104343",
     *   to: "+17853178070",
     *   webhook: "https://voiceapps.acme.com/myvoiceapp"
     * })
     * .then(console.log)         // successful response
     * .catch(console.error);     // an error occurred
     */
    call(request: CallRequest): Promise<CallResponse>;
}
export { CallManagerPB };
