"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const errors_1 = require("@fonos/errors");
const core_1 = require("@fonos/core");
const decoder_1 = __importDefault(require("./decoder"));
async function updateNumber(call, callback) {
    const number = call.request.getNumber();
    if (number.getAorLink() && number.getIngressInfo()) {
        callback(new errors_1.FonosInvalidArgument("'ingressInfo' and 'aorLink' are not compatible parameters"));
        return;
    }
    else if (!number.getAorLink() && !number.getIngressInfo()) {
        callback(new errors_1.FonosInvalidArgument("You must provider either an 'ingressInfo' or and 'aorLink'"));
        return;
    }
    let encoder = new core_1.ResourceBuilder(core_1.Kind.NUMBER, number.getE164Number(), number.getRef());
    if (number.getAorLink()) {
        encoder = encoder
            .withLocation(`tel:${number.getE164Number()}`, number.getAorLink())
            .withMetadata({
            gwRef: number.getProviderRef(),
            createdOn: number.getCreateTime(),
            modifiedOn: number.getUpdateTime()
        });
    }
    else {
        encoder = encoder
            .withLocation(`tel:${number.getE164Number()}`, process.env.MS_ENDPOINT)
            .withMetadata({
            webhook: number.getIngressInfo()
                ? number.getIngressInfo().getWebhook()
                : undefined,
            gwRef: number.getProviderRef(),
            createdOn: number.getCreateTime(),
            modifiedOn: number.getUpdateTime()
        });
    }
    const resource = encoder.build();
    try {
        await core_1.routr.connect();
        const ref = await core_1.routr.resourceType("numbers").update(resource);
        // We do this to get updated metadata from Routr
        const jsonObj = await core_1.routr.resourceType("numbers").get(ref);
        callback(null, decoder_1.default(jsonObj));
    }
    catch (err) {
        return callback(err);
    }
}
exports.default = updateNumber;
