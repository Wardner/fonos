"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@fonos/core");
const decoder_1 = __importDefault(require("./decoder"));
const assertions_1 = require("../utils/assertions");
const redis = core_1.getRedisConnection();
async function createNumber(number, call) {
    assertions_1.assertIsE164(number);
    assertions_1.assertHasAorLinkOrIngressInfo(number);
    let encoder = new core_1.ResourceBuilder(core_1.Kind.NUMBER, number.getE164Number())
        .withGatewayRef(number.getProviderRef())
        .withMetadata({ accessKeyId: core_1.getAccessKeyId(call) });
    if (number.getAorLink()) {
        encoder = encoder.withLocation(`tel:${number.getE164Number()}`, number.getAorLink());
    }
    else {
        // TODO: Perhaps I should place this in a ENV
        encoder = encoder
            .withLocation(`tel:${number.getE164Number()}`, process.env.MS_ENDPOINT)
            .withMetadata({
            webhook: number.getIngressInfo().getWebhook(),
            accessKeyId: core_1.getAccessKeyId(call)
        });
    }
    const resource = encoder.build();
    await core_1.routr.connect();
    const ref = await core_1.routr.resourceType("numbers").create(resource);
    // We do this to get updated metadata from Routr
    const jsonObj = await core_1.routr.resourceType("numbers").get(ref);
    return decoder_1.default(jsonObj);
}
exports.default = createNumber;
