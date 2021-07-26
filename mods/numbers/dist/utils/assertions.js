"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertHasAorLinkOrIngressInfo = exports.assertIsE164 = void 0;
const errors_1 = require("@fonos/errors");
const assertIsE164 = (number) => {
    if (!number.getE164Number()) {
        throw new errors_1.FonosInvalidArgument("e164Number field must be a valid e164 value.");
    }
};
exports.assertIsE164 = assertIsE164;
const assertHasAorLinkOrIngressInfo = (number) => {
    if (number.getAorLink() && number.getIngressInfo()) {
        throw new errors_1.FonosInvalidArgument("'webhook' and 'aorLink' are not compatible parameters");
    }
    else if (!number.getAorLink() && !number.getIngressInfo()) {
        throw new errors_1.FonosInvalidArgument("You must provider either an 'webhook' or and 'aorLink'");
    }
};
exports.assertHasAorLinkOrIngressInfo = assertHasAorLinkOrIngressInfo;
